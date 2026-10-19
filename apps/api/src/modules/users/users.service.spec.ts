import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UsersService } from './users.service.js';
import { RoleType, AccountStatus } from '../../common/common.constants.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService RBAC & Profile Tests', () => {
  let prisma: PrismaService;
  let usersService: UsersService;

  const studentEmail = `student.test.${Date.now()}@example.com`;
  const adminEmail = `admin.test.${Date.now()}@example.com`;
  let studentUserId: string;
  let adminUserId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    usersService = new UsersService(prisma);

    const passwordHash = await bcrypt.hash('TestPassword123!', 10);

    // Create STUDENT user
    const student = await prisma.user.create({
      data: {
        email: studentEmail,
        passwordHash,
        status: AccountStatus.ACTIVE,
        profile: {
          create: {
            firstName: 'Shakib',
            lastName: 'Ahmed',
            preferredLanguage: 'bn',
            targetAusbildungField: 'IT / Fachinformatiker',
          },
        },
      },
    });
    studentUserId = student.id;

    // Create ADMIN user
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        status: AccountStatus.ACTIVE,
        profile: {
          create: {
            firstName: 'Super',
            lastName: 'Admin',
            preferredLanguage: 'de',
          },
        },
      },
    });
    adminUserId = admin.id;

    // Assign roles
    const studentRole = await prisma.role.findUnique({ where: { name: RoleType.STUDENT } });
    if (studentRole) {
      await prisma.userRole.create({
        data: { userId: studentUserId, roleId: studentRole.id },
      });
    }

    const adminRole = await prisma.role.findUnique({ where: { name: RoleType.ADMIN } });
    if (adminRole) {
      await prisma.userRole.create({
        data: { userId: adminUserId, roleId: adminRole.id },
      });
    }
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { in: [studentEmail, adminEmail] } },
    });
    await prisma.$disconnect();
  });

  it('1. should retrieve the authenticated student profile with roles and details', async () => {
    const me = await usersService.getMe(studentUserId);
    expect(me.id).toBe(studentUserId);
    expect(me.email).toBe(studentEmail);
    expect(me.roles).toContain(RoleType.STUDENT);
    expect(me.profile?.targetAusbildungField).toBe('IT / Fachinformatiker');
    expect(me.profile?.preferredLanguage).toBe('bn');
  });

  it('2. should fail when attempting to fetch profile for non-existent user ID', async () => {
    await expect(usersService.getMe('non-existent-uuid-12345')).rejects.toThrow(NotFoundException);
  });

  it('3. should update the user profile preferences', async () => {
    const updated = await usersService.updateProfile(studentUserId, {
      firstName: 'Shakibul',
      preferredLanguage: 'de',
      targetAusbildungField: 'Pflegefachmann (Nursing)',
    });

    expect(updated.firstName).toBe('Shakibul');
    expect(updated.preferredLanguage).toBe('de');
    expect(updated.targetAusbildungField).toBe('Pflegefachmann (Nursing)');
  });

  it('4. admin should list users with pagination and role filters', async () => {
    const result = await usersService.listUsers(1, 10, RoleType.STUDENT);
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.pagination.totalItems).toBeGreaterThan(0);
    expect(result.items.some((u) => u.id === studentUserId)).toBe(true);
  });

  it('5. admin can assign new roles to a user', async () => {
    const result = await usersService.assignRole(studentUserId, RoleType.INSTRUCTOR, adminUserId);
    expect(result.success).toBe(true);

    const user = await usersService.getMe(studentUserId);
    expect(user.roles).toContain(RoleType.INSTRUCTOR);
  });

  it('6. assigning the same role again should throw BadRequestException', async () => {
    await expect(
      usersService.assignRole(studentUserId, RoleType.INSTRUCTOR, adminUserId),
    ).rejects.toThrow(BadRequestException);
  });

  it('7. admin can update account status to SUSPENDED and revoke sessions', async () => {
    const result = await usersService.updateUserStatus(studentUserId, AccountStatus.SUSPENDED, adminUserId);
    expect(result.status).toBe(AccountStatus.SUSPENDED);

    const user = await usersService.getMe(studentUserId);
    expect(user.status).toBe(AccountStatus.SUSPENDED);
  });

  it('8. admin can remove an assigned role', async () => {
    const result = await usersService.removeRole(studentUserId, RoleType.INSTRUCTOR, adminUserId);
    expect(result.success).toBe(true);

    const user = await usersService.getMe(studentUserId);
    expect(user.roles).not.toContain(RoleType.INSTRUCTOR);
  });
});
