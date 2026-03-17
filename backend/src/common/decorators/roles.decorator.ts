import { SetMetadata } from '@nestjs/common';

export type UserRole = 'patient' | 'provider' | 'admin';

export const ROLES_KEY = 'roles';

/** Attach required roles to a route handler. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
