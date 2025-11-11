// Re-export Prisma enums for convenience
import { Request } from 'express';
import { Role, PropertyType, PropertyStatus, RequestStatus } from '@prisma/client';

export { Role, PropertyType, PropertyStatus, RequestStatus };

// DTOs
export interface UserDTO {
  name: string;
  phone: string;
  role: Role;
  nationalId?: string;
  password: string;
}

export interface PropertyDTO {
  title: string;
  type: PropertyType;
  price: number;
  location: string;
  rooms?: number;
  ownerId: string;
}

export interface RequestDTO {
  tenantId: string;
  propertyId: string;
  message?: string;
}

export interface CommissionDTO {
  propertyId: string;
  commissionerId: string;
  amount: number;
}

export interface LoginDTO {
  phone: string;
  password: string;
}

export interface PropertyFilters {
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  rooms?: number;
  status?: PropertyStatus;
  verified?: boolean;
}

export interface RequestFilters {
  status?: RequestStatus;
  tenantId?: string;
  propertyId?: string;
}

export interface CommissionFilters {
  commissionerId?: string;
  propertyId?: string;
}

// API Response Types
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: Record<string, string | string[]>;
  meta?: {
    page?: number;
    pageSize?: number;
    totalItems?: number;
    totalPages?: number;
  };
}

export interface PaginatedResult<T> {
  data: T[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  role: Role;
  phone: string;
}

// Express Request with User
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: Role;
    phone: string;
  };
}
