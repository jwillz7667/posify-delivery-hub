import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PincodeMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    
    const token = authHeader.split(' ')[1];
    const decoded = this.jwtService.decode(token);
    
    if (decoded?.pincodeRequired) {
      if (!decoded?.pincodeVerified) {
        return res.status(403).json({
          message: 'Pincode verification required',
          code: 'PINCODE_REQUIRED'
        });
      }
      
      if (new Date(decoded.exp * 1000) > decoded.pincodeExpiresAt) {
        return res.status(403).json({
          message: 'Pincode has expired',
          code: 'PINCODE_EXPIRED'
        });
      }
    }
    
    next();
  }
} 