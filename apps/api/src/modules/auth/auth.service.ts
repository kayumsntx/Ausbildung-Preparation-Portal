import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { ResetPasswordDto } from './dto/reset-password.dto.js';
import { RoleType, AccountStatus } from '../../common/common.constants.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async register(dto: RegisterDto, clientIp?: string, userAgent?: string) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Enforce uniqueness
    const existing = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });
    if (existing) {
      throw new ConflictException('An account with this email address already exists.');
    }

    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const verificationTokenRaw = randomBytes(32).toString('hex');
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Atomic transaction ensuring all initialization records are created together
    const result = await this.prisma.$transaction(async (tx) => {
      // Ensure STUDENT role exists
      let studentRole = await tx.role.findUnique({
        where: { name: RoleType.STUDENT },
      });
      if (!studentRole) {
        studentRole = await tx.role.create({
          data: {
            name: RoleType.STUDENT,
            description: 'Standard vocational applicant / student role',
          },
        });
      }

      // Create User
      const user = await tx.user.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          status: AccountStatus.ACTIVE,
          emailVerified: false,
          profile: {
            create: {
              firstName: dto.firstName,
              lastName: dto.lastName,
              preferredLanguage: dto.preferredLanguage || 'en',
              targetAusbildungField: dto.targetAusbildungField,
            },
          },
          roles: {
            create: {
              roleId: studentRole.id,
            },
          },
          notificationPreference: {
            create: {},
          },
          emailVerificationTokens: {
            create: {
              token: verificationTokenRaw,
              expiresAt: verificationExpiresAt,
            },
          },
        },
        include: {
          profile: true,
          roles: { include: { role: true } },
        },
      });

      // Audit Log
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: 'USER_REGISTERED',
          targetEntity: 'User',
          targetId: user.id,
          details: { email: user.email, targetField: dto.targetAusbildungField },
          ipAddress: clientIp,
        },
      });

      return { user, verificationTokenRaw };
    });

    const roles = result.user.roles.map((r) => r.role.name);
    const tokens = await this.generateTokens(result.user.id, result.user.email, roles, clientIp, userAgent);

    return {
      user: {
        id: result.user.id,
        email: result.user.email,
        status: result.user.status,
        emailVerified: result.user.emailVerified,
        roles,
        profile: result.user.profile,
      },
      tokens,
      verificationTokenPreview: verificationTokenRaw, // For development verification testing
    };
  }

  async login(dto: LoginDto, clientIp?: string, userAgent?: string) {
    const normalizedEmail = dto.email.trim().toLowerCase();

    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        profile: true,
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (user.status === AccountStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended. Please contact support.');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const roles = user.roles.map((r) => r.role.name);
    const tokens = await this.generateTokens(user.id, user.email, roles, clientIp, userAgent);

    // Audit Log
    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'USER_LOGIN',
        targetEntity: 'User',
        targetId: user.id,
        ipAddress: clientIp,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        status: user.status,
        emailVerified: user.emailVerified,
        roles,
        profile: user.profile,
      },
      tokens,
    };
  }

  async refreshTokens(rawRefreshToken: string, clientIp?: string, userAgent?: string) {
    if (!rawRefreshToken) {
      throw new UnauthorizedException('Missing refresh token.');
    }

    const tokenHash = this.hashToken(rawRefreshToken);
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: {
        user: {
          include: {
            roles: { include: { role: true } },
          },
        },
      },
    });

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Token reuse detection (Compromised session security)
    if (tokenRecord.isRevoked) {
      this.logger.warn(`Potential token theft detected for user ${tokenRecord.userId}. Revoking all sessions.`);
      await this.prisma.refreshToken.updateMany({
        where: { userId: tokenRecord.userId },
        data: { isRevoked: true },
      });
      throw new UnauthorizedException('Security alert: Refresh token reuse detected. All sessions revoked.');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired.');
    }

    // Rotate token: revoke current token
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { isRevoked: true },
    });

    const roles = tokenRecord.user.roles.map((r) => r.role.name);
    const tokens = await this.generateTokens(tokenRecord.user.id, tokenRecord.user.email, roles, clientIp, userAgent);

    return tokens;
  }

  async logout(rawRefreshToken?: string, userId?: string) {
    if (rawRefreshToken) {
      const tokenHash = this.hashToken(rawRefreshToken);
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      });
    }

    if (userId) {
      await this.prisma.auditLog.create({
        data: {
          actorId: userId,
          action: 'USER_LOGOUT',
          targetEntity: 'User',
          targetId: userId,
        },
      });
    }

    return { success: true };
  }

  async verifyEmail(token: string) {
    const record = await this.prisma.emailVerificationToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.isUsed || record.expiresAt < new Date()) {
      throw new BadRequestException('Verification token is invalid, expired, or already used.');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: {
          emailVerified: true,
          status: AccountStatus.ACTIVE,
        },
      }),
      this.prisma.emailVerificationToken.update({
        where: { id: record.id },
        data: { isUsed: true },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: record.userId,
          action: 'EMAIL_VERIFIED',
          targetEntity: 'User',
          targetId: record.userId,
        },
      }),
    ]);

    return { verified: true, email: record.user.email };
  }

  async forgotPassword(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    let resetTokenRaw: string | undefined = undefined;

    if (user && user.status !== AccountStatus.SUSPENDED) {
      resetTokenRaw = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetTokenRaw,
          expiresAt,
        },
      });

      await this.prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'PASSWORD_RESET_REQUESTED',
          targetEntity: 'User',
          targetId: user.id,
        },
      });
    }

    // Anti-enumeration: Always return success message regardless of existence
    return {
      message: 'If an account exists with this email address, password reset instructions have been issued.',
      resetTokenPreview: resetTokenRaw, // Included for local test automation
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { token: dto.token },
    });

    if (!record || record.isUsed || record.expiresAt < new Date()) {
      throw new BadRequestException('Password reset token is invalid or expired.');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, this.saltRounds);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { isUsed: true },
      }),
      // Revoke all existing sessions for security
      this.prisma.refreshToken.updateMany({
        where: { userId: record.userId },
        data: { isRevoked: true },
      }),
      this.prisma.auditLog.create({
        data: {
          actorId: record.userId,
          action: 'PASSWORD_RESET_COMPLETED',
          targetEntity: 'User',
          targetId: record.userId,
        },
      }),
    ]);

    return { success: true, message: 'Password has been reset successfully. Please log in with your new credentials.' };
  }

  private async generateTokens(
    userId: string,
    email: string,
    roles: string[],
    clientIp?: string,
    userAgent?: string,
  ) {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'default_jwt_access_secret_32_bytes_min';
    const accessExpiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';

    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email, roles },
      { secret: accessSecret, expiresIn: accessExpiresIn as any },
    );

    // Cryptographic random refresh token
    const rawRefreshToken = randomBytes(48).toString('base64url');
    const tokenHash = this.hashToken(rawRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        clientIp,
        userAgent,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900, // 15 mins in seconds
    };
  }
}
