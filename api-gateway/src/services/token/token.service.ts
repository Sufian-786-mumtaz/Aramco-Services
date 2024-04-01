import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { VerifyToken } from './interface/verify.interface';

@Injectable()
export class TokenService {
  constructor() {}

  async createToken(email: string): Promise<string> {
    const hash = crypto
      .createHmac('sha256', `${process.env.TOKEN_SECRET}`)
      .update(email)
      .digest('hex');
    return hash;
  }

  async verifyToken(verifyToken: VerifyToken): Promise<boolean> {
    const hashedValue = await this.createToken(verifyToken.email);
    return verifyToken.hash === hashedValue;
  }
}
