import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService Integration & Security Tests', () => {
  let prisma: PrismaService;
  let authService: AuthService;
  let jwtService: JwtService;
  let configService: ConfigService;

  const testEmail = `test.applicant.${Date.now()}@example.com`;
  const testPassword = 'SecurePassword123!';
  let createdUserId: string;
  let refreshToken: string;
  let verificationToken: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();

    configService = new ConfigService({
      JWT_ACCESS_SECRET: 'test_jwt_access_secret_for_automated_testing_purposes',
      JWT_ACCESS_EXPIRES_IN: '15m',
    });

    jwtService = new JwtService();
    authService = new AuthService(prisma, jwtService, configService);
  });

  afterAll(async () => {
    // Clean up test records
    if (createdUserId) {
      await prisma.user.deleteMany({ where: { email: testEmail } });
    }
    await prisma.$disconnect();
  });

  it('1. should register a new applicant with hashed password and verification token', async () => {
    const result = await authService.register({
      email: testEmail,
      password: testPassword,
      firstName: 'Tanvir',
      lastName: 'Hasan',
      targetAusbildungField: 'Pflegefachmann (Nursing)',
      preferredLanguage: 'bn',
    });

    expect(result).toBeDefined();
    expect(result.user.email).toBe(testEmail);
    expect(result.user.emailVerified).toBe(false);
    expect(result.user.roles).toContain('STUDENT');
    expect(result.tokens.accessToken).toBeDefined();
    expect(result.tokens.refreshToken).toBeDefined();

    createdUserId = result.user.id;
    refreshToken = result.tokens.refreshToken;
    verificationToken = result.verificationTokenPreview;

    // Verify password is NOT stored in plaintext
    const dbUser = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(dbUser?.passwordHash).not.toBe(testPassword);
    expect(dbUser?.passwordHash).toMatch(/^\$2[aby]\$/); // Valid bcrypt hash pattern
  });

  it('2. should reject duplicate email registration with 409 Conflict', async () => {
    await expect(
      authService.register({
        email: testEmail,
        password: 'AnotherPassword123!',
      }),
    ).rejects.toThrow(ConflictException);
  });

  it('3. should successfully log in with correct credentials', async () => {
    const loginResult = await authService.login({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResult.user.id).toBe(createdUserId);
    expect(loginResult.tokens.accessToken).toBeDefined();
    expect(loginResult.tokens.refreshToken).toBeDefined();
  });

  it('4. should reject login with incorrect password with 401 Unauthorized', async () => {
    await expect(
      authService.login({
        email: testEmail,
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('5. should reject login for non-existent email with 401 Unauthorized (anti-enumeration)', async () => {
    await expect(
      authService.login({
        email: 'nobody@nowhere.com',
        password: 'SomePassword!',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('6. should rotate refresh tokens and detect token reuse theft', async () => {
    // Rotate valid refresh token
    const newTokens = await authService.refreshTokens(refreshToken);
    expect(newTokens.accessToken).toBeDefined();
    expect(newTokens.refreshToken).toBeDefined();
    expect(newTokens.refreshToken).not.toBe(refreshToken);

    // Replay attack: attempting to reuse the old revoked refresh token
    await expect(authService.refreshTokens(refreshToken)).rejects.toThrow(UnauthorizedException);
  });

  it('7. should verify email address with valid token and activate account', async () => {
    const verifyResult = await authService.verifyEmail(verificationToken);
    expect(verifyResult.verified).toBe(true);

    const updatedUser = await prisma.user.findUnique({ where: { id: createdUserId } });
    expect(updatedUser?.emailVerified).toBe(true);
    expect(updatedUser?.status).toBe('ACTIVE');
  });

  it('8. should reject re-using an already consumed email verification token', async () => {
    await expect(authService.verifyEmail(verificationToken)).rejects.toThrow(BadRequestException);
  });

  it('9. should handle forgot-password with anti-enumeration protection', async () => {
    const result = await authService.forgotPassword(testEmail);
    expect(result.message).toContain('If an account exists');
    expect(result.resetTokenPreview).toBeDefined();

    // Testing with non-existent email must return identical safe message
    const nonExistentResult = await authService.forgotPassword('nonexistent@domain.com');
    expect(nonExistentResult.message).toBe(result.message);
  });

  it('10. should reset password with valid token and revoke older sessions', async () => {
    const forgotResult = await authService.forgotPassword(testEmail);
    const resetToken = forgotResult.resetTokenPreview!;

    const newPassword = 'NewlyUpdatedPassword2026!';
    const resetResult = await authService.resetPassword({
      token: resetToken,
      newPassword,
    });

    expect(resetResult.success).toBe(true);

    // Old password fails
    await expect(
      authService.login({
        email: testEmail,
        password: testPassword,
      }),
    ).rejects.toThrow(UnauthorizedException);

    // New password succeeds
    const newLogin = await authService.login({
      email: testEmail,
      password: newPassword,
    });
    expect(newLogin.user.id).toBe(createdUserId);
  });
});
