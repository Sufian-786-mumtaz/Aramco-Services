import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException('Token is missing in request');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.JWT_ACCESS_SECRET}`,
      });

      if (payload.user.role !== 'admin') {
        throw new UnauthorizedException('OnlyAdminsAuthorizedError');
      }

      request['user'] = payload;
    } catch (error) {
      if (error.name === 'TokenExpiredError')
        throw new ForbiddenException('Your token has expired');
      if (error.message === 'OnlyAdminsAuthorizedError')
        throw new ForbiddenException('Only admins are authorized');
      throw new UnauthorizedException('Invalid token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
