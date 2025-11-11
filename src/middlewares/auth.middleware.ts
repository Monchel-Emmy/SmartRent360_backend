import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthenticatedRequest } from '../types';
import { sendError } from '../utils/response';

const authService = new AuthService();

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      sendError(res, 'Access token required', undefined, 401);
      return;
    }

    const payload = authService.verifyToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role,
      phone: payload.phone,
    };

    next();
  } catch (error) {
    sendError(res, 'Invalid or expired token', undefined, 401);
  }
}

