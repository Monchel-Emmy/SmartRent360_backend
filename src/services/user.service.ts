import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';
import { UserDTO, LoginDTO } from '../types';
import { User } from '@prisma/client';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async register(dto: UserDTO): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByPhone(dto.phone);
    if (existingUser) {
      throw new Error('User with this phone number already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(dto: LoginDTO): Promise<{ user: Omit<User, 'password'>; token: string }> {
    // Find user by phone
    const user = await this.userRepository.findByPhone(dto.phone);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(dto.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    // Generate JWT token (will be done in auth service)
    return {
      user: userWithoutPassword,
      token: '', // Will be set by auth service
    };
  }

  async getUserById(id: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      return null;
    }
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getPendingVerification(page: number, pageSize: number) {
    return this.userRepository.findPendingVerification(page, pageSize);
  }

  async verifyUser(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.userRepository.verifyUser(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getAllUsers(page: number, pageSize: number) {
    return this.userRepository.findAll(page, pageSize);
  }
}

