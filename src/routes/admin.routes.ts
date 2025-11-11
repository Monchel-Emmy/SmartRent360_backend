import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { AdminService } from '../services/admin.service';
import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { RequestRepository } from '../repositories/request.repository';
import { CommissionRepository } from '../repositories/commission.repository';
import { authenticateToken } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/rbac.middleware';
import { Role } from '../types';

const router = Router();

// Initialize dependencies
const userRepository = new UserRepository();
const propertyRepository = new PropertyRepository();
const requestRepository = new RequestRepository();
const commissionRepository = new CommissionRepository();
const adminService = new AdminService(
  userRepository,
  propertyRepository,
  requestRepository,
  commissionRepository
);
const adminController = new AdminController(adminService);

/**
 * @swagger
 * /v1/admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     description: Retrieve platform statistics including total users, properties, requests, commissions, pending items, and revenue. Admin only.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
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
 *                   example: Statistics retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/AdminStats'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin role required
 */
router.get('/stats', authenticateToken, requireRole(Role.ADMIN), (req, res) => adminController.getStats(req, res));

export default router;

