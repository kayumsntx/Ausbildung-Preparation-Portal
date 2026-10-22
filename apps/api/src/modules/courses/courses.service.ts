import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';
import { EnrollCourseDto } from './dto/enroll-course.dto.js';
import { CompleteLessonDto } from './dto/complete-lesson.dto.js';
import { EnrollmentStatus, OrderStatus, PaymentMethod } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lists all published courses with module and lesson counts, filterable by category, level, and price.
   * Annotates enrollment progress if user is authenticated.
   */
  async getCourses(query: QueryCoursesDto, userId?: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };

    if (query.category) {
      where.category = { contains: query.category, mode: 'insensitive' };
    }

    if (query.level) {
      where.level = { contains: query.level, mode: 'insensitive' };
    }

    if (query.isFree !== undefined) {
      where.isFree = query.isFree;
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { instructor: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const [courses, totalItems] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: true,
          modules: {
            include: {
              lessons: {
                select: { id: true },
              },
            },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    let enrollmentMap = new Map<string, { status: EnrollmentStatus; progress: number }>();

    if (userId) {
      const enrollments = await this.prisma.courseEnrollment.findMany({
        where: { userId },
        select: { courseId: true, status: true, progressPercentage: true },
      });
      enrollmentMap = new Map(
        enrollments.map((e) => [e.courseId, { status: e.status, progress: e.progressPercentage }]),
      );
    }

    return {
      items: courses.map((c) => {
        const totalLessons = c.modules.flatMap((m) => m.lessons).length;
        const userEnrollment = enrollmentMap.get(c.id);

        return {
          id: c.id,
          slug: c.slug,
          title: c.title,
          level: c.level,
          category: c.category,
          badge: c.badge,
          description: c.description,
          durationHours: c.durationHours,
          isFree: c.isFree,
          priceCents: c.priceCents,
          coinPrice: c.coinPrice,
          instructor: c.instructor,
          modulesCount: c.modules.length,
          lessonsCount: totalLessons,
          isEnrolled: !!userEnrollment,
          enrollmentStatus: userEnrollment?.status || null,
          progressPercentage: userEnrollment?.progress ?? null,
        };
      }),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Retrieves single course syllabus and lessons by slug.
   * Server-side protects video and text content for paid courses unless enrolled or marked free preview.
   */
  async getCourseBySlug(slug: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        instructor: true,
        modules: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            lessons: {
              orderBy: { sequenceOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundException(`Course with slug "${slug}" was not found.`);
    }

    let isEnrolled = false;
    let enrollment: any = null;
    let completedLessonIds = new Set<string>();

    if (userId) {
      enrollment = await this.prisma.courseEnrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
        include: {
          lessonProgress: true,
          certificate: true,
        },
      });

      if (enrollment) {
        isEnrolled = true;
        completedLessonIds = new Set(
          enrollment.lessonProgress.map((p: any) => p.lessonId),
        );
      }
    }

    const hasFullAccess = course.isFree || isEnrolled;

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      level: course.level,
      category: course.category,
      badge: course.badge,
      description: course.description,
      durationHours: course.durationHours,
      isFree: course.isFree,
      priceCents: course.priceCents,
      coinPrice: course.coinPrice,
      instructor: course.instructor,
      isEnrolled,
      enrollment: enrollment
        ? {
            status: enrollment.status,
            progressPercentage: enrollment.progressPercentage,
            enrolledAt: enrollment.enrolledAt,
            completedAt: enrollment.completedAt,
            certificate: enrollment.certificate,
          }
        : null,
      modules: course.modules.map((m) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        sequenceOrder: m.sequenceOrder,
        lessons: m.lessons.map((l) => {
          const isCompleted = completedLessonIds.has(l.id);
          const canViewContent = hasFullAccess || l.isFreePreview;

          return {
            id: l.id,
            slug: l.slug,
            title: l.title,
            durationMinutes: l.durationMinutes,
            sequenceOrder: l.sequenceOrder,
            isFreePreview: l.isFreePreview,
            isCompleted,
            locked: !canViewContent,
            videoUrl: canViewContent ? l.videoUrl : null,
            textContent: canViewContent ? l.textContent : null,
            resources: canViewContent ? l.resources : null,
          };
        }),
      })),
    };
  }

  /**
   * Enrolls the student into a free or paid course with order idempotency.
   */
  async enrollCourse(userId: string, courseId: string, dto: EnrollCourseDto) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" was not found.`);
    }

    // Check existing enrollment
    const existingEnrollment = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingEnrollment) {
      return {
        enrolled: true,
        alreadyEnrolled: true,
        enrollmentId: existingEnrollment.id,
        status: existingEnrollment.status,
        message: 'You are already enrolled in this course.',
      };
    }

    const paymentMethod = dto.paymentMethod || (course.isFree ? PaymentMethod.FREE : PaymentMethod.COINS);

    // Validate payment requirements for non-free courses
    if (!course.isFree && paymentMethod === PaymentMethod.FREE) {
      throw new BadRequestException('This is a paid course. Please select Coins or Stripe card checkout.');
    }

    const idempotencyKey = dto.idempotencyKey || `idem_${crypto.randomUUID()}`;

    return this.prisma.$transaction(async (tx) => {
      // Create order entry
      await tx.order.create({
        data: {
          userId,
          courseId,
          amountCents: course.isFree ? 0 : course.priceCents,
          coinsAmount: course.isFree ? 0 : course.coinPrice,
          paymentMethod,
          status: OrderStatus.COMPLETED,
          idempotencyKey,
        },
      });

      // Create enrollment
      const enrollment = await tx.courseEnrollment.create({
        data: {
          userId,
          courseId,
          status: EnrollmentStatus.ACTIVE,
          progressPercentage: 0,
        },
      });

      return {
        enrolled: true,
        enrollmentId: enrollment.id,
        status: enrollment.status,
        message: course.isFree
          ? 'Enrolled in free course successfully!'
          : `Enrolled successfully via ${paymentMethod}!`,
      };
    });
  }

  /**
   * Marks a lesson completed for an enrolled student.
   * Recalculates progress percentage and automatically issues a verifiable certificate upon 100% completion.
   */
  async completeLesson(userId: string, courseId: string, dto: CompleteLessonDto) {
    const enrollment = await this.prisma.courseEnrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
        user: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Active enrollment not found for this course.');
    }

    const allLessons = enrollment.course.modules.flatMap((m) => m.lessons);
    const targetLesson = allLessons.find((l) => l.id === dto.lessonId);

    if (!targetLesson) {
      throw new BadRequestException('The specified lesson does not belong to this course.');
    }

    return this.prisma.$transaction(async (tx) => {
      // Record lesson progress
      await tx.courseLessonProgress.upsert({
        where: {
          enrollmentId_lessonId: {
            enrollmentId: enrollment.id,
            lessonId: dto.lessonId,
          },
        },
        update: {
          isCompleted: true,
          completedAt: new Date(),
        },
        create: {
          enrollmentId: enrollment.id,
          lessonId: dto.lessonId,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      const completedCount = await tx.courseLessonProgress.count({
        where: { enrollmentId: enrollment.id, isCompleted: true },
      });

      const totalLessons = allLessons.length;
      const progressPercentage =
        totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 100;

      const isFinished = progressPercentage === 100;
      let certificate = null;

      if (isFinished) {
        const existingCert = await tx.certificate.findUnique({
          where: { enrollmentId: enrollment.id },
        });

        if (!existingCert) {
          const year = new Date().getFullYear();
          const cleanSlug = enrollment.course.slug.slice(0, 4).toUpperCase();
          const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
          const certificateCode = `CERT-${year}-${cleanSlug}-${randomSuffix}`;

          const recipientName =
            enrollment.user.profile?.firstName && enrollment.user.profile?.lastName
              ? `${enrollment.user.profile.firstName} ${enrollment.user.profile.lastName}`
              : enrollment.user.email.split('@')[0];

          const verificationHash = crypto
            .createHash('sha256')
            .update(`${userId}:${courseId}:${certificateCode}:${Date.now()}`)
            .digest('hex');

          certificate = await tx.certificate.create({
            data: {
              certificateCode,
              userId,
              courseId,
              enrollmentId: enrollment.id,
              recipientName,
              courseTitle: enrollment.course.title,
              verificationHash,
            },
          });
        } else {
          certificate = existingCert;
        }
      }

      const updatedEnrollment = await tx.courseEnrollment.update({
        where: { id: enrollment.id },
        data: {
          progressPercentage,
          status: isFinished ? EnrollmentStatus.COMPLETED : EnrollmentStatus.ACTIVE,
          completedAt: isFinished && !enrollment.completedAt ? new Date() : enrollment.completedAt,
          lastAccessedAt: new Date(),
        },
      });

      return {
        enrollmentId: updatedEnrollment.id,
        progressPercentage,
        status: updatedEnrollment.status,
        completedLessonId: dto.lessonId,
        certificate,
      };
    });
  }

  /**
   * Retrieves all courses currently enrolled by the authenticated user.
   */
  async getUserEnrollments(userId: string) {
    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: { userId },
      orderBy: { lastAccessedAt: 'desc' },
      include: {
        course: {
          include: {
            instructor: true,
            modules: {
              include: {
                lessons: {
                  select: { id: true },
                },
              },
            },
          },
        },
        certificate: true,
      },
    });

    return enrollments.map((e) => ({
      enrollmentId: e.id,
      courseId: e.courseId,
      status: e.status,
      progressPercentage: e.progressPercentage,
      enrolledAt: e.enrolledAt,
      completedAt: e.completedAt,
      lastAccessedAt: e.lastAccessedAt,
      course: {
        id: e.course.id,
        slug: e.course.slug,
        title: e.course.title,
        level: e.course.level,
        category: e.course.category,
        badge: e.course.badge,
        durationHours: e.course.durationHours,
        totalLessons: e.course.modules.flatMap((m) => m.lessons).length,
        instructor: e.course.instructor,
      },
      certificate: e.certificate,
    }));
  }

  /**
   * Public verification endpoint to validate certificate authenticity by code.
   */
  async verifyCertificate(certificateCode: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { certificateCode },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
      },
    });

    if (!cert) {
      throw new NotFoundException(`Certificate with code "${certificateCode}" was not found.`);
    }

    return {
      isValid: true,
      certificateCode: cert.certificateCode,
      recipientName: cert.recipientName,
      courseTitle: cert.courseTitle,
      issuedAt: cert.issuedAt,
      verificationHash: cert.verificationHash,
      instructor: cert.course.instructor.name,
      accreditation: 'Ausbildung Preparation Portal — Certified Educational Curriculum',
    };
  }
}
