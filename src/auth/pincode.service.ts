import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { pincodeConfig } from '../config/pincode.config';

@Injectable()
export class PincodeService {
  constructor(private prisma: PrismaService) {}

  private getExpirationDate() {
    const date = new Date();
    date.setDate(date.getDate() + pincodeConfig.expirationDays);
    return date;
  }

  async setPincode(userId: number, pincode: string) {
    const hashedPincode = await bcrypt.hash(pincode, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { 
        pincode: hashedPincode,
        pincodeExpiresAt: this.getExpirationDate(),
        pincodeLastVerified: new Date()
      }
    });
  }

  async verifyPincode(userId: number, pincode: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.pincode) return false;
    return bcrypt.compare(pincode, user.pincode);
  }

  async checkExpiration(userId: number) {
    const user = await this.prisma.user.findUnique({ 
      where: { id: userId },
      select: { pincodeExpiresAt: true }
    });
    
    return {
      isExpired: user?.pincodeExpiresAt < new Date(),
      expiresAt: user?.pincodeExpiresAt
    };
  }
} 