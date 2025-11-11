import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JWTPayload } from '../types';

export class AuthService {
  generateToken(payload: JWTPayload): string {
    const tokenPayload: Record<string, string> = {
      userId: payload.userId,
      role: String(payload.role),
      phone: payload.phone,
    };
    return jwt.sign(tokenPayload, config.jwtSecret as string, {
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as JWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

