import { PropertyRepository } from '../repositories/property.repository';
import { UserRepository } from '../repositories/user.repository';
import { PropertyDTO, PropertyFilters } from '../types';
import { Property } from '@prisma/client';

export class PropertyService {
  constructor(
    private propertyRepository: PropertyRepository,
    private userRepository: UserRepository
  ) {}

  async createProperty(dto: PropertyDTO): Promise<Property> {
    // Verify owner exists and is verified
    const owner = await this.userRepository.findById(dto.ownerId);
    if (!owner) {
      throw new Error('Owner not found');
    }

    if (!owner.verified) {
      throw new Error('Owner must be verified to create properties');
    }

    return this.propertyRepository.create(dto);
  }

  async searchProperties(filters: PropertyFilters, page: number, pageSize: number) {
    return this.propertyRepository.search(filters, page, pageSize);
  }

  async getPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async updateProperty(
    id: string,
    data: Partial<PropertyDTO>,
    userId: string,
    userRole: string
  ): Promise<Property> {
    const property = await this.propertyRepository.findById(id);
    if (!property) {
      throw new Error('Property not found');
    }

    // Only owner or admin can update
    if (property.ownerId !== userId && userRole !== 'ADMIN') {
      throw new Error('Unauthorized to update this property');
    }

    return this.propertyRepository.update(id, data);
  }

  async verifyProperty(id: string): Promise<Property> {
    return this.propertyRepository.verifyProperty(id);
  }

  async getPendingVerification(page: number, pageSize: number) {
    return this.propertyRepository.findPendingVerification(page, pageSize);
  }
}

