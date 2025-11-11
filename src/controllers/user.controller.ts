import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UserDTO, LoginDTO } from '../types';
import { sendSuccess, sendPaginatedSuccess, sendError } from '../utils/response';
import { getPaginationParams } from '../utils/pagination';
import { body, param } from 'express-validator';
import { Role } from '@prisma/client';

export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const dto: UserDTO = req.body;
      const user = await this.userService.register(dto);
      sendSuccess(res, 'User registered successfully', user, 201);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      sendError(res, message, undefined, 400);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const dto: LoginDTO = req.body;
      const { user } = await this.userService.login(dto);
      const jwtToken = this.authService.generateToken({
        userId: user.id,
        role: user.role as Role,
        phone: user.phone,
      });

      sendSuccess(res, 'Login successful', { user, token: jwtToken });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      sendError(res, message, undefined, 401);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        sendError(res, 'User not found', undefined, 404);
        return;
      }

      sendSuccess(res, 'User retrieved successfully', user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve user';
      sendError(res, message, undefined, 500);
    }
  }

  async verifyUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.userService.verifyUser(id);
      sendSuccess(res, 'User verified successfully', user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to verify user';
      sendError(res, message, undefined, 500);
    }
  }

  async getPendingVerification(req: Request, res: Response): Promise<void> {
    try {
      const { page, pageSize } = getPaginationParams(req.query);
      const result = await this.userService.getPendingVerification(page, pageSize);
      sendPaginatedSuccess(res, 'Pending users retrieved', {
        data: result.data.map((u) => {
          const { password, ...userWithoutPassword } = u;
          return userWithoutPassword;
        }),
        totalItems: result.totalItems,
        page,
        pageSize,
        totalPages: Math.ceil(result.totalItems / pageSize),
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve pending users';
      sendError(res, message, undefined, 500);
    }
  }
}

// Validation rules
export const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required').isMobilePhone('any').withMessage('Invalid phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['TENANT', 'LANDLORD', 'COMMISSIONER']).withMessage('Invalid role'),
  body('nationalId').optional().trim(),
];

export const loginValidation = [
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const userIdValidation = [
  param('id').isUUID().withMessage('Invalid user ID'),
];

