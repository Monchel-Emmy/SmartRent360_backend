import { Request, Response } from 'express';
import { RequestService } from '../services/request.service';
import { RequestDTO, RequestFilters, AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { body, param, query } from 'express-validator';

export class RequestController {
  constructor(private requestService: RequestService) {}

  async createRequest(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const dto: RequestDTO = {
        ...req.body,
        tenantId: authReq.user?.id || req.body.tenantId,
      };
      const request = await this.requestService.createRequest(dto);
      sendSuccess(res, 'Request created successfully', request, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create request';
      sendError(res, message, undefined, 400);
    }
  }

  async getRequests(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = getPaginationParams(req.query);
      const filters: RequestFilters = {
        status: req.query.status as any,
        tenantId: req.query.tenantId as string,
        propertyId: req.query.propertyId as string,
      };

      const result = await this.requestService.getRequests(filters, page, pageSize);
      sendPaginatedSuccess(res, 'Requests retrieved', {
        data: result.data,
        totalItems: result.totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(result.totalItems / pageSize),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve requests';
      sendError(res, message, undefined, 500);
    }
  }

  async getRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.requestService.getRequestById(id);

      if (!request) {
        sendError(res, 'Request not found', undefined, 404);
        return;
      }

      sendSuccess(res, 'Request retrieved successfully', request);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve request';
      sendError(res, message, undefined, 500);
    }
  }

  async connectRequest(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;

      if (!authReq.user) {
        sendError(res, 'Authentication required', undefined, 401);
        return;
      }

      const request = await this.requestService.connectRequest(id, authReq.user.id);
      sendSuccess(res, 'Request connected successfully', request);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to connect request';
      sendError(res, message, undefined, 400);
    }
  }

  async completeRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const request = await this.requestService.completeRequest(id);
      sendSuccess(res, 'Request completed successfully', request);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to complete request';
      sendError(res, message, undefined, 400);
    }
  }
}

// Validation rules
export const createRequestValidation = [
  body('propertyId').isUUID().withMessage('Invalid property ID'),
  body('message').optional().trim(),
];

export const requestIdValidation = [
  param('id').isUUID().withMessage('Invalid request ID'),
];

export const requestFiltersValidation = [
  query('status').optional().isIn(['PENDING', 'CONNECTED', 'COMPLETED']).withMessage('Invalid request status'),
  query('tenantId').optional().isUUID().withMessage('Invalid tenant ID'),
  query('propertyId').optional().isUUID().withMessage('Invalid property ID'),
];

