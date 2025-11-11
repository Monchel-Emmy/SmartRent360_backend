import { Router } from 'express';
import {
  CommissionController,
  createCommissionValidation,
  commissionIdValidation,
  commissionFiltersValidation,
} from '../controllers/commission.controller';
import { CommissionService } from '../services/commission.service';
import { CommissionRepository } from '../repositories/commission.repository';
import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';

const router = Router();

// Initialize dependencies
const commissionRepository = new CommissionRepository();
const userRepository = new UserRepository();
const propertyRepository = new PropertyRepository();
const commissionService = new CommissionService(commissionRepository, userRepository, propertyRepository);
const commissionController = new CommissionController(commissionService);

/**
 * @swagger
 * /v1/commissions:
 *   post:
 *     summary: Record commission for a completed property deal
 *     description: Record a commission for a completed property deal. The SmartRent360 fee is automatically calculated (5% of commission amount). Requires authentication.
 *     tags: [Commissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCommissionRequest'
 *     responses:
 *       201:
 *         description: Commission recorded successfully
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
 *                   example: Commission recorded successfully
 *                 data:
 *                   $ref: '#/components/schemas/Commission'
 *       400:
 *         description: Validation error or commissioner not verified
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticateToken,
  validate(createCommissionValidation),
  (req, res) => commissionController.createCommission(req, res)
);

/**
 * @swagger
 * /v1/commissions:
 *   get:
 *     summary: Get all commissions
 *     description: Retrieve commissions with optional filters (commissionerId, propertyId). Returns paginated results. Requires authentication.
 *     tags: [Commissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: commissionerId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by commissioner ID
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
 *         description: Commissions retrieved successfully
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
 *                   example: Commissions retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Commission'
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
 *                       example: 50
 *                     totalPages:
 *                       type: number
 *                       example: 5
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticateToken,
  validate(commissionFiltersValidation),
  (req, res) => commissionController.getCommissions(req, res)
);

/**
 * @swagger
 * /v1/commissions/{id}:
 *   get:
 *     summary: Get commission details by ID
 *     description: Retrieve detailed information about a specific commission including property and commissioner details.
 *     tags: [Commissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Commission ID
 *     responses:
 *       200:
 *         description: Commission retrieved successfully
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
 *                   example: Commission retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/Commission'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Commission not found
 */
router.get(
  '/:id',
  authenticateToken,
  validate(commissionIdValidation),
  (req, res) => commissionController.getCommissionById(req, res)
);

export default router;

