import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Body,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Observable } from 'rxjs';
  import { Request } from 'express';
  
  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
    ) {}
  
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
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
 
        
        if (!request.session.user) {
          throw new UnauthorizedException('Session is invalid.');
        }

        this.jwtService.verify(token, { secret: "hola" });
        
        request.user = request.session.user;

  
        return true;
      } catch (error) {
       
        throw new Error("error in the Autenthication")
      }
    }
  }
  