import { PaginatedResult } from '../types';

export function paginate<T>(
  data: T[],
  totalItems: number,
  page: number,
  pageSize: number
): PaginatedResult<T> {
  return {
    data,
    totalItems,
    page,
    pageSize,
    totalPages: Math.ceil(totalItems / pageSize),
  };
}

export function getPaginationParams(query: {
  page?: string | number;
  pageSize?: string | number;
}): { page: number; pageSize: number } {
  const page = Math.max(1, Number(query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 10));
  return { page, pageSize };
}

