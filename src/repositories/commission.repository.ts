import prisma from '../config/database';
import { Commission } from '@prisma/client';
import { CommissionFilters } from '../types';

export class CommissionRepository {
  async create(data: {
    propertyId: string;
    commissionerId: string;
    amount: number;
    smartRentFee: number;
  }): Promise<Commission> {
    return prisma.commission.create({
      data,
      include: {
        property: {
          include: {
            owner: true,
          },
        },
        commissioner: true,
      },
    });
  }

  async findById(id: string): Promise<Commission | null> {
    return prisma.commission.findUnique({
      where: { id },
      include: {
        property: {
          include: {
            owner: true,
          },
        },
        commissioner: true,
      },
    });
  }

  async search(
    filters: CommissionFilters,
    page: number,
    pageSize: number
  ): Promise<{
    data: Commission[];
    totalItems: number;
  }> {
    const where: {
      commissionerId?: string;
      propertyId?: string;
    } = {};

    if (filters.commissionerId) where.commissionerId = filters.commissionerId;
    if (filters.propertyId) where.propertyId = filters.propertyId;

    const [data, totalItems] = await Promise.all([
      prisma.commission.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          property: {
            include: {
              owner: true,
            },
          },
          commissioner: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.commission.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findAll(page: number, pageSize: number): Promise<{
    data: Commission[];
    totalItems: number;
  }> {
    const [data, totalItems] = await Promise.all([
      prisma.commission.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          property: {
            include: {
              owner: true,
            },
          },
          commissioner: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.commission.count(),
    ]);

    return { data, totalItems };
  }
}

