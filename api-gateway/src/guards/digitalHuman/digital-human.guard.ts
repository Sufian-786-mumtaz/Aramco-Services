import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class DigitalHumanTokenGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['api-key'];
    if (!apiKey)
      throw new UnauthorizedException('Api key is missing in request');

    if (apiKey === process.env.API_KEY) {
      return true;
    } else {
      throw new UnauthorizedException('Api key is not valid');
    }
  }
}
