import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', err);

  // Handle known error types
  if (err.message.includes('not found')) {
    sendError(res, err.message, undefined, 404);
    return;
  }

  if (err.message.includes('Unauthorized') || err.message.includes('Invalid')) {
    sendError(res, err.message, undefined, 401);
    return;
  }

  if (err.message.includes('Insufficient') || err.message.includes('Forbidden')) {
    sendError(res, err.message, undefined, 403);
    return;
  }

  // Default error response
  sendError(res, 'Internal server error', undefined, 500);
}

