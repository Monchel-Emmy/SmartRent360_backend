import { Router } from 'express';
import {
  RequestController,
  createRequestValidation,
  requestIdValidation,
  requestFiltersValidation,
} from '../controllers/request.controller';
import { RequestService } from '../services/request.service';
import { RequestRepository } from '../repositories/request.repository';
import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { Role } from '../types';

const router = Router();

// Initialize dependencies
const requestRepository = new RequestRepository();
const userRepository = new UserRepository();
const propertyRepository = new PropertyRepository();
const requestService = new RequestService(requestRepository, userRepository, propertyRepository);
const requestController = new RequestController(requestService);

/**
 * @swagger
 * /v1/requests:
 *   post:
 *     summary: Submit interest request for a property
 *     description: Submit a request to show interest in a property. Requires authentication. The tenantId is automatically set from the authenticated user.
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequestRequest'
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Request created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Validation error, property not available, or duplicate request
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticateToken,
  validate(createRequestValidation),
  (req, res) => requestController.createRequest(req, res)
);

/**
 * @swagger
 * /v1/requests:
 *   get:
 *     summary: Get all requests
 *     description: Retrieve requests with optional filters (status, tenantId, propertyId). Returns paginated results. Requires authentication.
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONNECTED, COMPLETED]
 *         description: Filter by request status
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by tenant ID
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by property ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticateToken,
  validate(requestFiltersValidation),
  (req, res) => requestController.getRequests(req, res)
);

/**
 * @swagger
 * /v1/requests/{id}:
 *   get:
 *     summary: Get request details by ID
 *     description: Retrieve detailed information about a specific request including tenant and property details.
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Request retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Request not found
 */
router.get(
  '/:id',
  authenticateToken,
  validate(requestIdValidation),
  (req, res) => requestController.getRequestById(req, res)
);

/**
 * @swagger
 * /v1/requests/{id}/connect:
 *   patch:
 *     summary: Connect tenant to landlord/commissioner
 *     description: Connect a tenant request to the landlord/commissioner. This changes the request status to CONNECTED. Admin only.
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request connected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Request connected successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Request is not in pending status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Request not found
 */
router.patch(
  '/:id/connect',
  authenticateToken,
  requireRole(Role.ADMIN),
  validate(requestIdValidation),
  (req, res) => requestController.connectRequest(req, res)
);

/**
 * @swagger
 * /v1/requests/{id}/complete:
 *   patch:
 *     summary: Mark a request as completed
 *     description: Mark a request as completed after deal finalization. This changes the request status to COMPLETED and the property status to RENTED. Admin only.
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Request completed successfully
 *                 data:
 *                   $ref: '#/components/schemas/Request'
 *       400:
 *         description: Request must be connected before completion
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Request not found
 */
router.patch(
  '/:id/complete',
  authenticateToken,
  requireRole(Role.ADMIN),
  validate(requestIdValidation),
  (req, res) => requestController.completeRequest(req, res)
);

export default router;

