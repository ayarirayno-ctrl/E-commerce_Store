import { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface RetryConfig {
  maxRetries: number;
  retryDelay: number;
  retryCondition: (error: AxiosError) => boolean;
}

const defaultRetryConfig: RetryConfig = {
  maxRetries: 3,
  retryDelay: 1000, // milliseconds
  retryCondition: (error: AxiosError) => {
    // Retry on network errors or 5xx server errors
    return !error.response || (error.response.status >= 500 && error.response.status < 600);
  },
};

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  __retryCount?: number;
}

export const setupRetryInterceptor = (axiosInstance: AxiosInstance, config: Partial<RetryConfig> = {}) => {
  const retryConfig = { ...defaultRetryConfig, ...config };

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const requestConfig = error.config as RetryableRequestConfig | undefined;

      if (!requestConfig) {
        return Promise.reject(error);
      }

      // Initialize retry count
  const retryCount = requestConfig.__retryCount || 0;

      // Check if we should retry
      if (retryCount >= retryConfig.maxRetries || !retryConfig.retryCondition(error)) {
        return Promise.reject(error);
      }

      // Increment retry count
  requestConfig.__retryCount = retryCount + 1;

      // Calculate backoff delay (exponential)
      const backoffDelay = retryConfig.retryDelay * Math.pow(2, retryCount);

      // Log retry attempt in dev mode
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.log(
          `[api:retry] Attempt ${retryCount + 1}/${retryConfig.maxRetries} for ${requestConfig.method?.toUpperCase()} ${requestConfig.url} after ${backoffDelay}ms`
        );
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, backoffDelay));

      // Retry the request
      return axiosInstance(requestConfig);
    }
  );
};
