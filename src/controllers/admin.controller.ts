import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/response';

export class AdminController {
  constructor(private adminService: AdminService) {}

  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.adminService.getStats();
      sendSuccess(res, 'Statistics retrieved successfully', stats);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to retrieve statistics';
      sendError(res, message, undefined, 500);
    }
  }
}

