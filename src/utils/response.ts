import { Response } from 'express';
import { ApiResponse, PaginatedResult } from '../types';

export function sendSuccess<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    status: 'success',
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendPaginatedSuccess<T>(
  res: Response,
  message: string,
  result: PaginatedResult<T>,
  statusCode: number = 200
): void {
  const response: ApiResponse<T[]> = {
    status: 'success',
    message,
    data: result.data,
    meta: {
      page: result.page,
      pageSize: result.pageSize,
      totalItems: result.totalItems,
      totalPages: result.totalPages,
    },
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  errors?: Record<string, string | string[]>,
  statusCode: number = 400
): void {
  const response: ApiResponse<never> = {
    status: 'error',
    message,
    errors,
  };
  res.status(statusCode).json(response);
}

