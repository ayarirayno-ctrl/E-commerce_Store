import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

/**
 * Error Handler Utility
 * Centralized error handling for API calls and network issues
 */

export interface ErrorResponse {
  message: string;
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;
}

export class AppError extends Error {
  status?: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, status?: number, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

/**
 * Parse error from various sources
 */
export const parseError = (error: unknown): ErrorResponse => {
  // Axios error
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError<{message?: string; code?: string; errors?: Record<string, string[]>}>;
    
    // Network error (no response)
    if (!axiosError.response) {
      return {
        message: 'Erreur de connexion. Vérifiez votre connexion Internet.',
        status: 0,
        code: 'NETWORK_ERROR',
      };
    }

    // Server responded with error
    const response = axiosError.response;
    return {
      message: response.data?.message || 'Une erreur est survenue',
      status: response.status,
      code: response.data?.code || 'SERVER_ERROR',
      errors: response.data?.errors,
    };
  }

  // AppError
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      errors: error.errors,
    };
  }

  // Generic Error
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
    };
  }

  // Unknown error
  return {
    message: 'Une erreur inconnue est survenue',
    code: 'UNKNOWN_ERROR',
  };
};

/**
 * Check if error is a network error
 */
export const isNetworkError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.code === 'NETWORK_ERROR' || parsed.status === 0;
};

/**
 * Check if error is a server error (5xx)
 */
export const isServerError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return !!parsed.status && parsed.status >= 500 && parsed.status < 600;
};

/**
 * Check if error is a client error (4xx)
 */
export const isClientError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return !!parsed.status && parsed.status >= 400 && parsed.status < 500;
};

/**
 * Check if error is unauthorized (401)
 */
export const isUnauthorizedError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status === 401;
};

/**
 * Check if error is forbidden (403)
 */
export const isForbiddenError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status === 403;
};

/**
 * Check if error is not found (404)
 */
export const isNotFoundError = (error: unknown): boolean => {
  const parsed = parseError(error);
  return parsed.status === 404;
};

/**
 * Get user-friendly error message
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  const parsed = parseError(error);

  // Network errors
  if (isNetworkError(error)) {
    return 'Impossible de se connecter au serveur. Vérifiez votre connexion Internet.';
  }

  // Server errors
  if (isServerError(error)) {
    return 'Le serveur rencontre des difficultés. Veuillez réessayer plus tard.';
  }

  // Unauthorized
  if (isUnauthorizedError(error)) {
    return 'Vous devez être connecté pour effectuer cette action.';
  }

  // Forbidden
  if (isForbiddenError(error)) {
    return 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.';
  }

  // Not found
  if (isNotFoundError(error)) {
    return 'La ressource demandée est introuvable.';
  }

  // Default to server message
  return parsed.message;
};

/**
 * React Hook for error handling
 */
export const useErrorHandler = () => {
  const navigate = useNavigate();

  const handleError = (error: unknown, options?: {
    showNotification?: boolean;
    redirectOnNetworkError?: boolean;
    redirectOnServerError?: boolean;
  }) => {
    const {
      showNotification = true,
      redirectOnNetworkError = true,
      redirectOnServerError = true,
    } = options || {};

    const errorInfo = parseError(error);

    // Log error in development
    if (import.meta.env.DEV) {
      console.error('Error:', errorInfo);
    }

    // Handle network errors
    if (isNetworkError(error) && redirectOnNetworkError) {
      navigate('/network-error');
      return;
    }

    // Handle server errors
    if (isServerError(error) && redirectOnServerError) {
      navigate('/error');
      return;
    }

    // Handle unauthorized
    if (isUnauthorizedError(error)) {
      navigate('/auth');
      return;
    }

    // Handle not found
    if (isNotFoundError(error)) {
      navigate('/404');
      return;
    }

    // Show notification if enabled
    if (showNotification) {
      // This would integrate with your notification system
      const message = getUserFriendlyMessage(error);
      console.warn('Error notification:', message);
    }

    return errorInfo;
  };

  return { handleError, parseError, getUserFriendlyMessage };
};

/**
 * Retry logic for failed requests
 */
export const retryRequest = async <T,>(
  fn: () => Promise<T>,
  options?: {
    maxAttempts?: number;
    delay?: number;
    backoff?: boolean;
  }
): Promise<T> => {
  const {
    maxAttempts = 3,
    delay = 1000,
    backoff = true,
  } = options || {};

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry client errors (4xx)
      if (isClientError(error)) {
        throw error;
      }

      // If last attempt, throw error
      if (attempt === maxAttempts) {
        throw error;
      }

      // Wait before retrying
      const waitTime = backoff ? delay * attempt : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError;
};
