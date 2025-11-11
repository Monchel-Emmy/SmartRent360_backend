import { Router } from 'express';
import {
  PropertyController,
  createPropertyValidation,
  propertyIdValidation,
  propertyFiltersValidation,
} from '../controllers/property.controller';
import { PropertyService } from '../services/property.service';
import { PropertyRepository } from '../repositories/property.repository';
import { UserRepository } from '../repositories/user.repository';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { Role } from '../types';

const router = Router();

// Initialize dependencies
const propertyRepository = new PropertyRepository();
const userRepository = new UserRepository();
const propertyService = new PropertyService(propertyRepository, userRepository);
const propertyController = new PropertyController(propertyService);

/**
 * @swagger
 * /v1/properties:
 *   get:
 *     summary: Search and list properties
 *     description: Search properties with filters (type, location, price range, rooms, status, verification). Returns paginated results.
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [HOUSE, APARTMENT, PLOT, ROOM]
 *         description: Filter by property type
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location (partial match)
 *       - in: query
 *         name: rooms
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Filter by number of rooms
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, RENTED, SOLD]
 *         description: Filter by property status
 *       - in: query
 *         name: verified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
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
 *         description: Properties retrieved successfully
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
 *                   example: Properties retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     pageSize:
 *                       type: number
 *                       example: 10
 *                     totalItems:
 *                       type: number
 *                       example: 100
 *                     totalPages:
 *                       type: number
 *                       example: 10
 */
router.get('/', validate(propertyFiltersValidation), (req, res) => propertyController.searchProperties(req, res));

/**
 * @swagger
 * /v1/properties/{id}:
 *   get:
 *     summary: Get property details by ID
 *     description: Retrieve detailed information about a specific property including owner and media.
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property retrieved successfully
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
 *                   example: Property retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 */
router.get('/:id', validate(propertyIdValidation), (req, res) => propertyController.getPropertyById(req, res));

/**
 * @swagger
 * /v1/properties:
 *   post:
 *     summary: Create a new property listing
 *     description: Create a new property listing. Requires authentication. The ownerId is automatically set from the authenticated user.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePropertyRequest'
 *     responses:
 *       201:
 *         description: Property created successfully
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
 *                   example: Property created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error or owner not verified
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticateToken,
  validate(createPropertyValidation),
  (req, res) => propertyController.createProperty(req, res)
);

/**
 * @swagger
 * /v1/properties/{id}:
 *   patch:
 *     summary: Update property details
 *     description: Update property information. Only the property owner or admin can update.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePropertyRequest'
 *     responses:
 *       200:
 *         description: Property updated successfully
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
 *                   example: Property updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       400:
 *         description: Validation error or unauthorized
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Property not found
 */
router.patch(
  '/:id',
  authenticateToken,
  validate(propertyIdValidation),
  (req, res) => propertyController.updateProperty(req, res)
);

/**
 * @swagger
 * /v1/properties/{id}/verify:
 *   patch:
 *     summary: Verify a property listing
 *     description: Verify a property listing. Only admins can verify properties.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID to verify
 *     responses:
 *       200:
 *         description: Property verified successfully
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
 *                   example: Property verified successfully
 *                 data:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 *       404:
 *         description: Property not found
 */
router.patch(
  '/:id/verify',
  authenticateToken,
  requireRole(Role.ADMIN),
  validate(propertyIdValidation),
  (req, res) => propertyController.verifyProperty(req, res)
);

/**
 * @swagger
 * /v1/properties/pending/verification:
 *   get:
 *     summary: Get all properties pending verification
 *     description: Retrieve a paginated list of properties pending verification. Admin only.
 *     tags: [Properties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Pending properties retrieved successfully
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
 *                   example: Pending properties retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Property'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: number
 *                       example: 1
 *                     pageSize:
 *                       type: number
 *                       example: 10
 *                     totalItems:
 *                       type: number
 *                       example: 25
 *                     totalPages:
 *                       type: number
 *                       example: 3
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get(
  '/pending/verification',
  authenticateToken,
  requireRole(Role.ADMIN),
  (req, res) => propertyController.getPendingVerification(req, res)
);

export default router;

