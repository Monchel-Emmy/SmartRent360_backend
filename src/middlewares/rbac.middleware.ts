import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { Role } from '../types';
import { sendError } from '../utils/response';

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(res, 'Authentication required', undefined, 401);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      sendError(res, 'Insufficient permissions', undefined, 403);
      return;
    }

    next();
  };
}

