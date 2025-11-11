import { Request, Response } from 'express';
import { CommissionService } from '../services/commission.service';
import { CommissionDTO, CommissionFilters } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { body, param, query } from 'express-validator';

export class CommissionController {
  constructor(private commissionService: CommissionService) {}

  async createCommission(req: Request, res: Response): Promise<void> {
    try {
      const dto: CommissionDTO = req.body;
      const commission = await this.commissionService.createCommission(dto);
      sendSuccess(res, 'Commission recorded successfully', commission, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create commission';
      sendError(res, message, undefined, 400);
    }
  }

  async getCommissions(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = getPaginationParams(req.query);
      const filters: CommissionFilters = {
        commissionerId: req.query.commissionerId as string,
        propertyId: req.query.propertyId as string,
      };

      const result = await this.commissionService.getCommissions(filters, page, pageSize);
      sendPaginatedSuccess(res, 'Commissions retrieved', {
        data: result.data,
        totalItems: result.totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(result.totalItems / pageSize),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve commissions';
      sendError(res, message, undefined, 500);
    }
  }

  async getCommissionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const commission = await this.commissionService.getCommissionById(id);

      if (!commission) {
        sendError(res, 'Commission not found', undefined, 404);
        return;
      }

      sendSuccess(res, 'Commission retrieved successfully', commission);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve commission';
      sendError(res, message, undefined, 500);
    }
  }
}

// Validation rules
export const createCommissionValidation = [
  body('propertyId').isUUID().withMessage('Invalid property ID'),
  body('commissionerId').isUUID().withMessage('Invalid commissioner ID'),
  body('amount').isInt({ min: 0 }).withMessage('Amount must be a positive integer'),
];

export const commissionIdValidation = [
  param('id').isUUID().withMessage('Invalid commission ID'),
];

export const commissionFiltersValidation = [
  query('commissionerId').optional().isUUID().withMessage('Invalid commissioner ID'),
  query('propertyId').optional().isUUID().withMessage('Invalid property ID'),
];

