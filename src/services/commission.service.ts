import { CommissionRepository } from '../repositories/commission.repository';
import { UserRepository } from '../repositories/user.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { CommissionDTO, CommissionFilters } from '../types';
import { Commission } from '@prisma/client';

// SmartRent360 fee percentage (e.g., 5% of commission)
const SMART_RENT_FEE_PERCENTAGE = 0.05;

export class CommissionService {
  constructor(
    private commissionRepository: CommissionRepository,
    private userRepository: UserRepository,
    private propertyRepository: PropertyRepository
  ) {}

  async createCommission(dto: CommissionDTO): Promise<Commission> {
    // Verify commissioner exists and is verified
    const commissioner = await this.userRepository.findById(dto.commissionerId);
    if (!commissioner) {
      throw new Error('Commissioner not found');
    }

    if (commissioner.role !== 'COMMISSIONER') {
      throw new Error('User must be a commissioner');
    }

    if (!commissioner.verified) {
      throw new Error('Commissioner must be verified');
    }

    // Verify property exists
    const property = await this.propertyRepository.findById(dto.propertyId);
    if (!property) {
      throw new Error('Property not found');
    }

    // Calculate SmartRent360 fee
    const smartRentFee = Math.round(dto.amount * SMART_RENT_FEE_PERCENTAGE);

    return this.commissionRepository.create({
      ...dto,
      smartRentFee,
    });
  }

  async getCommissions(filters: CommissionFilters, page: number, pageSize: number) {
    return this.commissionRepository.search(filters, page, pageSize);
  }

  async getCommissionById(id: string): Promise<Commission | null> {
    return this.commissionRepository.findById(id);
  }

  async getAllCommissions(page: number, pageSize: number) {
    return this.commissionRepository.findAll(page, pageSize);
  }
}

