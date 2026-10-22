import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { CoursesService } from './courses.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { EnrollmentStatus, PaymentMethod } from '@prisma/client';

describe('CoursesService Integration & LMS Tests', () => {
  let prisma: PrismaService;
  let coursesService: CoursesService;
  let testUserId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    coursesService = new CoursesService(prisma);

    // Create a temporary test user
    const testUser = await prisma.user.create({
      data: {
        email: `courses.test.${Date.now()}@example.com`,
        passwordHash: 'test_hash_for_courses_service',
        status: 'ACTIVE',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Tanvir',
            lastName: 'Hasan',
          },
        },
      },
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.deleteMany({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  it('1. should list courses and filter by price and category', async () => {
    const allCourses = await coursesService.getCourses({ page: 1, limit: 10 }, testUserId);
    expect(allCourses.items).toBeDefined();
    expect(allCourses.items.length).toBeGreaterThanOrEqual(4);

    const freeCourses = await coursesService.getCourses({ isFree: true }, testUserId);
    expect(freeCourses.items.every((c) => c.isFree)).toBe(true);

    const medicalCourses = await coursesService.getCourses(
      { category: 'Healthcare Terminology' },
      testUserId,
    );
    expect(medicalCourses.items.some((c) => c.slug.includes('medical-german'))).toBe(true);
  });

  it('2. should enforce server-side content locking on paid courses for unenrolled users', async () => {
    const course = await coursesService.getCourseBySlug(
      'b2-medical-german-nursing-ausbildung',
      testUserId,
    );
    expect(course).toBeDefined();
    expect(course.isFree).toBe(false);
    expect(course.isEnrolled).toBe(false);

    // Lesson 1 isFreePreview = true -> videoUrl accessible
    const lesson1 = course.modules[0].lessons[0];
    expect(lesson1.isFreePreview).toBe(true);
    expect(lesson1.locked).toBe(false);
    expect(lesson1.videoUrl).toBeDefined();

    // Lesson 2 isFreePreview = false -> locked server-side
    const lesson2 = course.modules[0].lessons[1];
    expect(lesson2.isFreePreview).toBe(false);
    expect(lesson2.locked).toBe(true);
    expect(lesson2.videoUrl).toBeNull();
  });

  it('3. should enroll student in a free course with idempotency', async () => {
    const freeCourse = await prisma.course.findFirst({ where: { isFree: true } });
    expect(freeCourse).toBeDefined();

    const result = await coursesService.enrollCourse(testUserId, freeCourse!.id, {
      paymentMethod: PaymentMethod.FREE,
    });
    expect(result.enrolled).toBe(true);
    expect(result.status).toBe(EnrollmentStatus.ACTIVE);

    // Re-enrollment idempotency check
    const duplicate = await coursesService.enrollCourse(testUserId, freeCourse!.id, {
      paymentMethod: PaymentMethod.FREE,
    });
    expect(duplicate.alreadyEnrolled).toBe(true);
  });

  it('4. should reject free enrollment for paid course and allow coin checkout', async () => {
    const paidCourse = await prisma.course.findFirst({ where: { isFree: false } });
    expect(paidCourse).toBeDefined();

    // Reject free enrollment on paid course
    await expect(
      coursesService.enrollCourse(testUserId, paidCourse!.id, {
        paymentMethod: PaymentMethod.FREE,
      }),
    ).rejects.toThrow(BadRequestException);

    // Enroll with coins
    const result = await coursesService.enrollCourse(testUserId, paidCourse!.id, {
      paymentMethod: PaymentMethod.COINS,
    });
    expect(result.enrolled).toBe(true);

    // Verify unlocked lessons
    const courseDetail = await coursesService.getCourseBySlug(paidCourse!.slug, testUserId);
    expect(courseDetail.isEnrolled).toBe(true);
    for (const mod of courseDetail.modules) {
      for (const les of mod.lessons) {
        expect(les.locked).toBe(false);
        expect(les.videoUrl).toBeDefined();
      }
    }
  });

  it('5. should track lesson completion and automatically issue verifiable certificate at 100%', async () => {
    const course = await prisma.course.findFirst({
      where: { slug: 'german-workplace-etiquette-embassy-mastery' },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });
    expect(course).toBeDefined();

    // Enroll
    await coursesService.enrollCourse(testUserId, course!.id, {
      paymentMethod: PaymentMethod.FREE,
    });

    const lessons = course!.modules.flatMap((m) => m.lessons);
    expect(lessons.length).toBeGreaterThanOrEqual(1);

    // Complete all lessons in course
    let lastResult = null;
    for (const les of lessons) {
      lastResult = await coursesService.completeLesson(testUserId, course!.id, {
        lessonId: les.id,
      });
    }

    expect(lastResult).toBeDefined();
    expect(lastResult!.progressPercentage).toBe(100);
    expect(lastResult!.status).toBe(EnrollmentStatus.COMPLETED);
    expect(lastResult!.certificate).toBeDefined();
    expect(lastResult!.certificate.certificateCode).toContain('CERT-');
    expect(lastResult!.certificate.verificationHash).toBeDefined();

    // Public Certificate Verification
    const verification = await coursesService.verifyCertificate(
      lastResult!.certificate.certificateCode,
    );
    expect(verification.isValid).toBe(true);
    expect(verification.recipientName).toBe('Tanvir Hasan');
    expect(verification.courseTitle).toBe(course!.title);
  });

  it('6. should reject invalid certificate codes with NotFoundException', async () => {
    await expect(coursesService.verifyCertificate('CERT-FAKE-INVALID-9999')).rejects.toThrow(
      NotFoundException,
    );
  });
});
