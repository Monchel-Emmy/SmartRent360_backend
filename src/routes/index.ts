import { Router } from 'express';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import requestRoutes from './request.routes';
import commissionRoutes from './commission.routes';
import adminRoutes from './admin.routes';
import { config } from '../config/env';

const router = Router();
const apiVersion = config.apiVersion;

// API routes
router.use(`/${apiVersion}/users`, userRoutes);
router.use(`/${apiVersion}/properties`, propertyRoutes);
router.use(`/${apiVersion}/requests`, requestRoutes);
router.use(`/${apiVersion}/commissions`, commissionRoutes);
router.use(`/${apiVersion}/admin`, adminRoutes);

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check if the API is running and healthy
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: SmartRent360 API is running
 */
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SmartRent360 API is running' });
});

export default router;

