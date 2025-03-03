
import { SetMetadata } from '@nestjs/common';
import { rolEnum } from '../enum/rol.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: rolEnum[]) => SetMetadata(ROLES_KEY, roles);
