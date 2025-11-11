import { RequestRepository } from '../repositories/request.repository';
import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { RequestDTO, RequestFilters } from '../types';
import { Request, RequestStatus } from '@prisma/client';

export class RequestService {
  constructor(
    private requestRepository: RequestRepository,
    private userRepository: UserRepository,
    private propertyRepository: PropertyRepository
  ) {}

  async createRequest(dto: RequestDTO): Promise<Request> {
    // Verify tenant exists and is verified
    const tenant = await this.userRepository.findById(dto.tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    if (!tenant.verified) {
      throw new Error('Tenant must be verified to submit requests');
    }

    // Verify property exists and is available
    const property = await this.propertyRepository.findById(dto.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    const { PropertyStatus } = await import('@prisma/client');
    if (property.status !== PropertyStatus.AVAILABLE) {
      throw new Error('Property is not available');
    }

    // Check if tenant already has a pending request for this property
    const existingRequests = await this.requestRepository.search(
      {
        tenantId: dto.tenantId,
        propertyId: dto.propertyId,
        status: RequestStatus.PENDING,
      },
      1,
      1
    );

    if (existingRequests.data.length > 0) {
      throw new Error('You already have a pending request for this property');
    }

    return this.requestRepository.create(dto);
  }

  async getRequests(filters: RequestFilters, page: number, pageSize: number) {
    return this.requestRepository.search(filters, page, pageSize);
  }

  async getRequestById(id: string): Promise<Request | null> {
    return this.requestRepository.findById(id);
  }

  async connectRequest(id: string, adminId: string): Promise<Request> {
    const request = await this.requestRepository.findById(id);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new Error('Request is not in pending status');
    }

    return this.requestRepository.connectRequest(id, adminId);
  }

  async completeRequest(id: string): Promise<Request> {
    const request = await this.requestRepository.findById(id);
    if (!request) {
      throw new Error('Request not found');
    }

    if (request.status !== RequestStatus.CONNECTED) {
      throw new Error('Request must be connected before completion');
    }

    // Update property status to RENTED
    const { PropertyStatus } = await import('@prisma/client');
    await this.propertyRepository.update(request.propertyId, {
      status: PropertyStatus.RENTED,
    });

    return this.requestRepository.completeRequest(id);
  }
}

