import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, RoleType } from '../common.constants.js';

export const Roles = (...roles: RoleType[]) => SetMetadata(ROLES_KEY, roles);
