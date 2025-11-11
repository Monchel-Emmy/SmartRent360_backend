import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { RequestRepository } from '../repositories/request.repository';
import { CommissionRepository } from '../repositories/commission.repository';
import prisma from '../config/database';

export interface AdminStats {
  totalUsers: number;
  totalProperties: number;
  totalRequests: number;
  totalCommissions: number;
  pendingUsers: number;
  pendingProperties: number;
  pendingRequests: number;
  totalCommissionAmount: number;
  totalSmartRentFee: number;
}

export class AdminService {
  // Repositories kept for future use
  constructor(
    // @ts-ignore - kept for future use
    private _userRepository: UserRepository,
    // @ts-ignore - kept for future use
    private _propertyRepository: PropertyRepository,
    // @ts-ignore - kept for future use
    private _requestRepository: RequestRepository,
    // @ts-ignore - kept for future use
    private _commissionRepository: CommissionRepository
  ) {}

  async getStats(): Promise<AdminStats> {
    const [
      totalUsers,
      totalProperties,
      totalRequests,
      totalCommissions,
      pendingUsers,
      pendingProperties,
      pendingRequests,
      commissionStats,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.request.count(),
      prisma.commission.count(),
      prisma.user.count({ where: { verified: false } }),
      prisma.property.count({ where: { verified: false } }),
      prisma.request.count({ where: { status: 'PENDING' as any } }),
      prisma.commission.aggregate({
        _sum: {
          amount: true,
          smartRentFee: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalProperties,
      totalRequests,
      totalCommissions,
      pendingUsers,
      pendingProperties,
      pendingRequests,
      totalCommissionAmount: commissionStats._sum.amount || 0,
      totalSmartRentFee: commissionStats._sum.smartRentFee || 0,
    };
  }
}

