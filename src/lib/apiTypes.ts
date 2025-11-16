export interface NormalizedApiError {
  status: 'fail' | 'error';
  statusCode: number;
  code?: string;
  message: string;
  path?: string;
  method?: string;
  requestId?: string;
  stack?: string;
  details?: unknown;
}
