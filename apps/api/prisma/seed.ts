import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Ausbildung Preparation Portal...');

  // 1. Seed Roles
  const roles = [
    { name: 'STUDENT', description: 'Standard vocational learner and applicant' },
    { name: 'INSTRUCTOR', description: 'Verified course instructor or educator' },
    { name: 'MODERATOR', description: 'Speaking community moderator & report reviewer' },
    { name: 'ADMIN', description: 'System administrator with least-privilege security clearance' },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name as any },
      update: { description: r.description },
      create: { name: r.name as any, description: r.description },
    });
  }
  console.log('✅ Core roles verified (STUDENT, INSTRUCTOR, MODERATOR, ADMIN).');

  // 2. Seed Development Admin (DEV ONLY)
  const adminEmail = 'admin.dev@ausbildungportal.de';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('AdminDevPassword2026!', 12);
    const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' as any } });

    if (adminRole) {
      await prisma.user.create({
        data: {
          email: adminEmail,
          passwordHash,
          status: 'ACTIVE',
          emailVerified: true,
          profile: {
            create: {
              firstName: 'System',
              lastName: 'Administrator',
              preferredLanguage: 'de',
              targetAusbildungField: 'Administration',
            },
          },
          roles: {
            create: {
              roleId: adminRole.id,
            },
          },
          notificationPreference: {
            create: {},
          },
        },
      });
      console.log('✅ Local development administrator seeded (admin.dev@ausbildungportal.de).');
    }
  }

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
