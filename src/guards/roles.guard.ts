import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorator/roles.decorator';
import { rolEnum } from 'src/enum/rol.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<rolEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );


    console.log('Roles requeridos:', requiredRoles[0]);

    if (!requiredRoles[0]) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('Usuario en request:', user);
    console.log(user,22222222);
    if (!user || !user.rol) {
      console.warn('No hay usuario o roles en la request');
      return false;
    }

    const userRoles = Array.isArray(user.rol) ? user.rol : [user.rol];

    console.log('Roles del usuario:', userRoles);

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
