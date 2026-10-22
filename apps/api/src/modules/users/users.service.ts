import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { RoleType, AccountStatus } from '../../common/common.constants.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: { include: { role: true } },
        notificationPreference: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User account not found.');
    }

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      roles: user.roles.map((r: { role: { name: string } }) => r.role.name),
      profile: user.profile,
      notificationPreference: user.notificationPreference,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        preferredLanguage: dto.preferredLanguage || 'en',
        targetAusbildungField: dto.targetAusbildungField,
        phoneNumber: dto.phoneNumber,
      },
      update: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.preferredLanguage !== undefined && { preferredLanguage: dto.preferredLanguage }),
        ...(dto.targetAusbildungField !== undefined && { targetAusbildungField: dto.targetAusbildungField }),
        ...(dto.phoneNumber !== undefined && { phoneNumber: dto.phoneNumber }),
      },
    });

    return profile;
  }

  async listUsers(page = 1, limit = 20, role?: RoleType, status?: AccountStatus) {
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && { status }),
      ...(role && {
        roles: {
          some: {
            role: { name: role },
          },
        },
      }),
    };

    const [totalItems, users] = await this.prisma.$transaction([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          roles: { include: { role: true } },
        },
      }),
    ]);

    const items = users.map((u: (typeof users)[number]) => ({
      id: u.id,
      email: u.email,
      status: u.status,
      emailVerified: u.emailVerified,
      createdAt: u.createdAt,
      roles: u.roles.map((r: { role: { name: string } }) => r.role.name),
      profile: u.profile,
    }));

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async updateUserStatus(targetUserId: string, status: AccountStatus, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) {
      throw new NotFoundException('Target user account not found.');
    }

    const updated = await this.prisma.user.update({
      where: { id: targetUserId },
      data: { status },
    });

    // If suspended, revoke all active sessions immediately
    if (status === AccountStatus.SUSPENDED) {
      await this.prisma.refreshToken.updateMany({
        where: { userId: targetUserId },
        data: { isRevoked: true },
      });
    }

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'ADMIN_UPDATE_USER_STATUS',
        targetEntity: 'User',
        targetId: targetUserId,
        details: { previousStatus: user.status, newStatus: status },
      },
    });

    return { id: updated.id, status: updated.status };
  }

  async assignRole(targetUserId: string, roleName: RoleType, adminId: string) {
    let role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      role = await this.prisma.role.create({
        data: { name: roleName },
      });
    }

    const existingUserRole = await this.prisma.userRole.findUnique({
      where: {
        userId_roleId: {
          userId: targetUserId,
          roleId: role.id,
        },
      },
    });

    if (existingUserRole) {
      throw new BadRequestException(`User already possesses the ${roleName} role.`);
    }

    await this.prisma.userRole.create({
      data: {
        userId: targetUserId,
        roleId: role.id,
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'ADMIN_ASSIGN_ROLE',
        targetEntity: 'User',
        targetId: targetUserId,
        details: { assignedRole: roleName },
      },
    });

    return { success: true, message: `Role ${roleName} assigned successfully.` };
  }

  async removeRole(targetUserId: string, roleName: RoleType, adminId: string) {
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      throw new NotFoundException(`Role ${roleName} does not exist.`);
    }

    await this.prisma.userRole.delete({
      where: {
        userId_roleId: {
          userId: targetUserId,
          roleId: role.id,
        },
      },
    });

    await this.prisma.auditLog.create({
      data: {
        actorId: adminId,
        action: 'ADMIN_REMOVE_ROLE',
        targetEntity: 'User',
        targetId: targetUserId,
        details: { removedRole: roleName },
      },
    });

    return { success: true, message: `Role ${roleName} removed successfully.` };
  }
}
