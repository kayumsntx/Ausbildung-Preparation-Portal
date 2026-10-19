export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

export enum RoleType {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export const REFRESH_TOKEN_COOKIE_NAME = 'ausbildung_refresh_token';
