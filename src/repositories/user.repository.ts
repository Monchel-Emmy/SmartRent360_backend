import prisma from '../config/database';
import { User, Role } from '@prisma/client';

export class UserRepository {
  async create(data: {
    name: string;
    phone: string;
    role: Role;
    password: string;
    nationalId?: string;
  }): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        properties: true,
        requests: true,
      },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { phone },
    });
  }

  async findPendingVerification(page: number, pageSize: number): Promise<{
    data: User[];
    totalItems: number;
  }> {
    const where = { verified: false };
    const [data, totalItems] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count({ where }),
    ]);

    return { data, totalItems };
  }

  async verifyUser(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { verified: true },
    });
  }

  async findAll(page: number, pageSize: number): Promise<{
    data: User[];
    totalItems: number;
  }> {
    const [data, totalItems] = await Promise.all([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { data, totalItems };
  }
}

