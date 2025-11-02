import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { NormalizedApiError } from './apiTypes.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export type { NormalizedApiError } from './apiTypes.ts';

// Extend AxiosRequestConfig to include retry count
interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

// Store reference will be set by App component
let notificationDispatcher: ((notification: {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  requestId?: string;
}) => void) | null = null;

export const setNotificationDispatcher = (dispatcher: typeof notificationDispatcher) => {
  notificationDispatcher = dispatcher;
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Attach Authorization from localStorage user token
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.token) {
        if (!config.headers) {
          config.headers = new (axios.AxiosHeaders as typeof import('axios').AxiosHeaders)();
        }
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch {
    // ignore parse errors
  }
  return config;
});

// Retry interceptor - runs FIRST (before error normalization)
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryableRequestConfig | undefined;

    if (!config) {
      return Promise.reject(error);
    }

    const statusCode = error.response?.status ?? 0;
    const retryCount = config.__retryCount || 0;
    const maxRetries = 3;

    // Retry on network errors or 5xx server errors (but not 4xx client errors)
    const shouldRetry = (!error.response || statusCode >= 500) && retryCount < maxRetries;

    if (shouldRetry) {
      config.__retryCount = retryCount + 1;
      const backoffDelay = 1000 * Math.pow(2, retryCount); // Exponential backoff: 1s, 2s, 4s

      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(
          `[api:retry] Attempt ${retryCount + 1}/${maxRetries} for ${config.method?.toUpperCase()} ${config.url} after ${backoffDelay}ms`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, backoffDelay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

// Pass through successful responses; you can log X-Request-Id if needed
api.interceptors.response.use(
  (response) => {
    const reqId = response.headers?.['x-request-id'];
    if (reqId) {
      // Lightweight trace; keep console noise low in production
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[api]', response.status, response.config.method?.toUpperCase(), response.config.url, 'reqId=', reqId);
      }
    }
    return response;
  },
  (error: AxiosError<unknown>) => {
    const statusCode = error.response?.status ?? 0;
    const headers = (error.response?.headers || {}) as Record<string, string>;
    const requestId = headers['x-request-id'];

    // Prefer backend payload fields if available
  const backendData = (error.response?.data || {}) as Partial<NormalizedApiError & { message?: string; code?: string; path?: string; }>;

    const normalized: NormalizedApiError = {
      status: statusCode >= 400 && statusCode < 500 ? 'fail' : 'error',
      statusCode,
      code: backendData.code || (statusCode === 404 ? 'NOT_FOUND' : statusCode === 401 ? 'UNAUTHORIZED' : statusCode >= 500 ? 'INTERNAL_SERVER_ERROR' : undefined),
      message: backendData.message || error.message || 'Request failed',
      path: backendData.path || error.config?.url,
      method: error.config?.method?.toUpperCase(),
      requestId,
      // include stack from backend in dev only
      stack: import.meta.env.DEV ? (backendData as Record<string, unknown>)?.['stack'] as string | undefined : undefined,
      details: backendData as unknown,
    };

    // Overwrite axios error response data to the normalized shape for consistent handling
    if (error.response) {
      (error as AxiosError<NormalizedApiError>).response!.data = normalized as unknown as NormalizedApiError;
    }
    
    // Auto-display error notifications (skip 401 to avoid spam during auth flows)
    if (notificationDispatcher && statusCode !== 401) {
      notificationDispatcher({
        type: 'error',
        title: `Erreur ${statusCode}`,
        message: normalized.message,
        duration: 6000,
        requestId,
      });
    }
    
    // eslint-disable-next-line no-console
    if (import.meta.env.DEV) console.warn('[api:error]', normalized);

    return Promise.reject(error);
  }
);

export default api;
