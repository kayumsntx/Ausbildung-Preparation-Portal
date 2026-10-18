/**
 * @ausbildung/shared-types
 * Core domain types and API contracts shared between Next.js web client,
 * NestJS backend, and future Flutter/React Native mobile clients.
 */

// Supported Application Locales
export type AppLocale = 'bn' | 'en' | 'de';

export const SUPPORTED_LOCALES: { code: AppLocale; name: string; flag: string }[] = [
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

// User Roles & Access Control
export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'MODERATOR' | 'ADMIN';

export type UserAccountStatus = 'PENDING_VERIFICATION' | 'ACTIVE' | 'SUSPENDED';

// German CEFR Learning Levels
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// Job Application Workflow Stages
export type ApplicationStage =
  | 'PLANNED'
  | 'APPLIED'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

// WebRTC Call Session Status
export type CallRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELED';

// Speaking Partner Gender Calling Preferences
export type GenderPreference = 'MALE' | 'FEMALE' | 'ANY' | 'NOBODY';
export type DeclaredGender = 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY';

// Virtual Coin Ledger Transaction Types
export type CoinTransactionType =
  | 'CREDIT'
  | 'DEBIT'
  | 'RESERVATION'
  | 'RELEASE'
  | 'REFUND';

export type CoinReferenceType =
  | 'TASK'
  | 'REFERRAL'
  | 'CALL'
  | 'PURCHASE'
  | 'ADMIN_ADJUSTMENT';

// Standard API Response Envelopes
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  meta?: ApiMetaPayload;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: { field?: string; issue: string }[];
  timestamp: string;
  correlationId?: string;
}

export interface ApiMetaPayload {
  timestamp: string;
  correlationId?: string;
  pagination?: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// User Profile Public & Authenticated Entities
export interface UserProfileDto {
  id: string;
  email: string;
  status: UserAccountStatus;
  roles: UserRole[];
  firstName?: string;
  lastName?: string;
  preferredLanguage: AppLocale;
  targetAusbildungField?: string;
  avatarUrl?: string;
  coinBalance?: number;
}
