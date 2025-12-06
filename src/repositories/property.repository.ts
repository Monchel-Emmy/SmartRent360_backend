import prisma from "../config/database";
import { Property, PropertyType, PropertyStatus } from "@prisma/client";
import { PropertyFilters } from "../types";

export class PropertyRepository {
  async create(data: {
    title: string;
    type: PropertyType;
    price: number;
    location: string;
    rooms?: number;
    ownerId: string;
    province: string;
    district: string;
    sector: string;
    cell: string;
    village: string;
    gpsLat?: number;
    gpsLng?: number;
    rules?: string[];
  }): Promise<Property> {
    return prisma.property.create({
      data,
      include: {
        owner: true,
        media: true,
      },
    });
  }

  async findById(id: string): Promise<Property | null> {
    return prisma.property.findUnique({
      where: { id },
      include: {
        owner: true,
        media: true,
        requests: true,
      },
    });
  }

  async search(
    filters: PropertyFilters,
    page: number,
    pageSize: number
  ): Promise<{
    data: Property[];
    totalItems: number;
  }> {
    const where: {
      type?: PropertyType;
      price?: { gte?: number; lte?: number };
      location?: { contains: string; mode?: "insensitive" };
      rooms?: number;
      status?: PropertyStatus;
      verified?: boolean;
      province?: { contains: string; mode?: "insensitive" };
      district?: { contains: string; mode?: "insensitive" };
      sector?: { contains: string; mode?: "insensitive" };
      cell?: { contains: string; mode?: "insensitive" };
      village?: { contains: string; mode?: "insensitive" };
    } = {};

    if (filters.type) where.type = filters.type;
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.location) {
      where.location = {
        contains: filters.location,
        mode: "insensitive",
      };
    }
    if (filters.rooms) where.rooms = filters.rooms;
    if (filters.status) where.status = filters.status;
    if (filters.verified !== undefined) where.verified = filters.verified;
    if (filters.province) {
      where.province = {
        contains: filters.province,
        mode: "insensitive",
      };
    }
    if (filters.district) {
      where.district = {
        contains: filters.district,
        mode: "insensitive",
      };
    }
    if (filters.sector) {
      where.sector = {
        contains: filters.sector,
        mode: "insensitive",
      };
    }
    if (filters.cell) {
      where.cell = {
        contains: filters.cell,
        mode: "insensitive",
      };
    }
    if (filters.village) {
      where.village = {
        contains: filters.village,
        mode: "insensitive",
      };
    }

    const [data, totalItems] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          owner: true,
          media: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return { data, totalItems };
  }

  async findPendingVerification(
    page: number,
    pageSize: number
  ): Promise<{
    data: Property[];
    totalItems: number;
  }> {
    const where = { verified: false };
    const [data, totalItems] = await Promise.all([
      prisma.property.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          owner: true,
          media: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.property.count({ where }),
    ]);

    return { data, totalItems };
  }

  async update(
    id: string,
    data: {
      title?: string;
      type?: PropertyType;
      price?: number;
      location?: string;
      rooms?: number;
      status?: PropertyStatus;
    }
  ): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data,
      include: {
        owner: true,
        media: true,
      },
    });
  }

  async verifyProperty(id: string): Promise<Property> {
    return prisma.property.update({
      where: { id },
      data: { verified: true },
      include: {
        owner: true,
        media: true,
      },
    });
  }

  async findByOwnerId(ownerId: string): Promise<Property[]> {
    return prisma.property.findMany({
      where: { ownerId },
      include: {
        media: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
