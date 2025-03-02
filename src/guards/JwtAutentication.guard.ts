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
        console.log(request)
        const authHeader = request.headers['authorization'];
    
  
        if (!authHeader) {
          throw new UnauthorizedException('Token not provided');
        }
        const token: string | undefined = authHeader.split(' ')[1]?.trim();
  console.log(token,11111111)
        if (!token) {
          throw new UnauthorizedException('Invalid or expired token');
        }
        console.log(request.session)
        console.log("va por aca")
        
        if (!request.session.user) {
          throw new UnauthorizedException('Session is invalid.');
        }
  console.log("luego aca")
        this.jwtService.verify(token, { secret: "hola" });
        
        request.user = request.session.user;
        console.log(request.user,1111)
  
        return true;
      } catch (error) {
       
        throw new Error("error in the Autenthication")
      }
    }
  }
  