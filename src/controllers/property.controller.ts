import { Request, Response } from 'express';
import { PropertyService } from '../services/property.service';
import { PropertyDTO, PropertyFilters, AuthenticatedRequest } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { body, param, query } from 'express-validator';

export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const dto: PropertyDTO = {
        ...req.body,
        ownerId: authReq.user?.id || req.body.ownerId,
      };
      const property = await this.propertyService.createProperty(dto);
      sendSuccess(res, 'Property created successfully', property, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create property';
      sendError(res, message, undefined, 400);
    }
  }

  async searchProperties(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = getPaginationParams(req.query);
      const filters: PropertyFilters = {
        type: req.query.type as any,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        location: req.query.location as string,
        rooms: req.query.rooms ? Number(req.query.rooms) : undefined,
        status: req.query.status as any,
        verified: req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined,
      };

      const result = await this.propertyService.searchProperties(filters, page, pageSize);
      sendPaginatedSuccess(res, 'Properties retrieved', {
        data: result.data,
        totalItems: result.totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(result.totalItems / pageSize),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve properties';
      sendError(res, message, undefined, 500);
    }
  }

  async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await this.propertyService.getPropertyById(id);

      if (!property) {
        sendError(res, 'Property not found', undefined, 404);
        return;
      }

      sendSuccess(res, 'Property retrieved successfully', property);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve property';
      sendError(res, message, undefined, 500);
    }
  }

  async updateProperty(req: Request, res: Response): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest;
      const { id } = req.params;
      const data = req.body;

      if (!authReq.user) {
        sendError(res, 'Authentication required', undefined, 401);
        return;
      }

      const property = await this.propertyService.updateProperty(
        id,
        data,
        authReq.user.id,
        authReq.user.role
      );
      sendSuccess(res, 'Property updated successfully', property);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update property';
      sendError(res, message, undefined, 400);
    }
  }

  async verifyProperty(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const property = await this.propertyService.verifyProperty(id);
      sendSuccess(res, 'Property verified successfully', property);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify property';
      sendError(res, message, undefined, 500);
    }
  }

  async getPendingVerification(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = getPaginationParams(req.query);
      const result = await this.propertyService.getPendingVerification(page, pageSize);
      sendPaginatedSuccess(res, 'Pending properties retrieved', {
        data: result.data,
        totalItems: result.totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(result.totalItems / pageSize),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve pending properties';
      sendError(res, message, undefined, 500);
    }
  }
}

// Validation rules
export const createPropertyValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('type').isIn(['HOUSE', 'APARTMENT', 'PLOT', 'ROOM']).withMessage('Invalid property type'),
  body('price').isInt({ min: 0 }).withMessage('Price must be a positive integer'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('rooms').optional().isInt({ min: 0 }).withMessage('Rooms must be a positive integer'),
];

export const propertyIdValidation = [
  param('id').isUUID().withMessage('Invalid property ID'),
];

export const propertyFiltersValidation = [
  query('type').optional().isIn(['HOUSE', 'APARTMENT', 'PLOT', 'ROOM']).withMessage('Invalid property type'),
  query('minPrice').optional().isInt({ min: 0 }).withMessage('Min price must be a positive integer'),
  query('maxPrice').optional().isInt({ min: 0 }).withMessage('Max price must be a positive integer'),
  query('rooms').optional().isInt({ min: 0 }).withMessage('Rooms must be a positive integer'),
  query('status').optional().isIn(['AVAILABLE', 'RENTED', 'SOLD']).withMessage('Invalid property status'),
  query('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
];

