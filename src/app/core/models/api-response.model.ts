export interface ApiResponse<T> {
  code: number;
  message: string;
  success: boolean;
  data: T;
  meta?: Record<string, any>;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimestampMeta {
  timestamp: string;
  processTime?: number;
}

export function isPaginationMeta(meta: Record<string, any> | undefined): meta is PaginationMeta {
  return !!meta &&
    typeof meta['total'] === 'number' &&
    typeof meta['page'] === 'number' &&
    typeof meta['totalPages'] === 'number';
}

export function isTimestampMeta(meta: Record<string, any> | undefined): meta is TimestampMeta {
  return !!meta && typeof meta['timestamp'] === 'string';
}
