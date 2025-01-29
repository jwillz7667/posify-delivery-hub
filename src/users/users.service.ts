import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto, requesterRole: Role) {
    if (createUserDto.role === 'ADMIN' && requesterRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can create admin users');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const hashedPincode = await bcrypt.hash(
      process.env.DEFAULT_PINCODE || '1234', 
      10
    );

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
        pincode: hashedPincode,
        pincodeRequired: createUserDto.role === 'STAFF'
      }
    });
  }
} 