import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GymGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();

      const idSession = request.user;

      if (!idSession) {
        throw new UnauthorizedException(
          'You do not have permissions on this gym.',
        );
      }
      const idGym = request.params.idGym;
      if (idGym) {
        if (idSession == idGym) {
          return true;
        }
        throw new UnauthorizedException(
          `You do not have permissions on this Gym`,
        );
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }
}
