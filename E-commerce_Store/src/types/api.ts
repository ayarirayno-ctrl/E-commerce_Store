/**
 * API type definitions
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  skip?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
}

