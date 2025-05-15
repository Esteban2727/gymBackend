import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('h0pa');
    try {
      const request = context.switchToHttp().getRequest();

      const authHeader = request.headers['authorization'];

      if (!authHeader) {
        throw new UnauthorizedException('Token not provided');
      }
      const token: string | undefined = authHeader.split(' ')[1]?.trim();

      if (!token) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request.user = payload;

      return true;
    } catch (error) {
      throw new Error(`error in the Autenthication, ${error}`);
    }
  }
}
