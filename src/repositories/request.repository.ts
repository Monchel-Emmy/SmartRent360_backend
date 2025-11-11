import prisma from '../config/database';
import { Request, RequestStatus } from '@prisma/client';
import { RequestFilters } from '../types';

export class RequestRepository {
  async create(data: {
    tenantId: string;
    propertyId: string;
    message?: string;
  }): Promise<Request> {
    return prisma.request.create({
      data,
      include: {
        tenant: true,
        property: {
          include: {
            owner: true,
            media: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Request | null> {
    return prisma.request.findUnique({
      where: { id },
      include: {
        tenant: true,
        property: {
          include: {
            owner: true,
            media: true,
          },
        },
      },
    });
  }

  async search(
    filters: RequestFilters,
    page: number,
    pageSize: number
  ): Promise<{
    data: Request[];
    totalItems: number;
  }> {
    const where: {
      status?: RequestStatus;
      tenantId?: string;
      propertyId?: string;
    } = {};

    if (filters.status) where.status = filters.status;
    if (filters.tenantId) where.tenantId = filters.tenantId;
    if (filters.propertyId) where.propertyId = filters.propertyId;

    const [data, totalItems] = await Promise.all([
      prisma.request.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          tenant: true,
          property: {
            include: {
              owner: true,
              media: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.request.count({ where }),
    ]);

    return { data, totalItems };
  }

  async update(
    id: string,
    data: {
      status?: RequestStatus;
      adminId?: string;
    }
  ): Promise<Request> {
    return prisma.request.update({
      where: { id },
      data,
      include: {
        tenant: true,
        property: {
          include: {
            owner: true,
            media: true,
          },
        },
      },
    });
  }

  async connectRequest(id: string, adminId: string): Promise<Request> {
    return this.update(id, {
      status: RequestStatus.CONNECTED,
      adminId,
    });
  }

  async completeRequest(id: string): Promise<Request> {
    return this.update(id, {
      status: RequestStatus.COMPLETED,
    });
  }
}

