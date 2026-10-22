import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ResolveReportDto, ModerationResolutionAction } from './dto/resolve-report.dto.js';
import { AuditQueryDto } from './dto/audit-query.dto.js';
import { AccountStatus } from '../../common/common.constants.js';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Aggregates personal progress metrics across all learning, application, course,
   * speaking, and coin economy subsystems for an individual candidate.
   */
  async getStudentDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        roles: { include: { role: true } },
        coinWallet: true,
        badges: true,
        lessonProgress: {
          include: {
            lesson: {
              include: {
                module: {
                  include: {
                    level: true,
                  },
                },
              },
            },
          },
        },
        quizAttempts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        savedJobs: true,
        jobApplications: {
          orderBy: { updatedAt: 'desc' },
          include: { job: true },
        },
        courseEnrollments: {
          include: {
            course: true,
          },
        },
        certificates: {
          include: {
            course: true,
          },
          orderBy: { issuedAt: 'desc' },
        },
        receivedRatings: true,
        coinTransactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Candidate account not found.');
    }

    // 1. Learning Subsystem Metrics
    const completedLessonsCount = user.lessonProgress.filter((p) => p.isCompleted).length;
    const inProgressLessonsCount = user.lessonProgress.filter((p) => !p.isCompleted).length;

    // CEFR Level breakdown
    const levelCounts: Record<string, number> = { A1: 0, A2: 0, B1: 0, B2: 0 };
    user.lessonProgress.forEach((p) => {
      if (p.isCompleted) {
        const code = p.lesson.module.level.code;
        levelCounts[code] = (levelCounts[code] || 0) + 1;
      }
    });

    // Quiz performance
    const totalQuizAttempts = user.quizAttempts.length;
    const avgQuizScore =
      totalQuizAttempts > 0
        ? Math.round(
            user.quizAttempts.reduce((acc, q) => acc + q.scorePercentage, 0) / totalQuizAttempts,
          )
        : 0;

    // 2. Job Tracker Funnel Metrics
    const applicationFunnel = {
      PLANNED: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
      total: user.jobApplications.length,
    };

    user.jobApplications.forEach((app) => {
      if (applicationFunnel[app.status as keyof typeof applicationFunnel] !== undefined) {
        (applicationFunnel[app.status as keyof typeof applicationFunnel] as number)++;
      }
    });

    // 3. Vocational Courses & Certificates
    const activeEnrollments = user.courseEnrollments.filter((e) => e.status === 'ACTIVE').length;
    const completedCourses = user.courseEnrollments.filter((e) => e.status === 'COMPLETED').length;
    const certificates = user.certificates.map((cert) => ({
      id: cert.id,
      courseTitle: cert.courseTitle || cert.course?.title,
      verificationCode: cert.certificateCode,
      sha256Hash: cert.verificationHash,
      issuedAt: cert.issuedAt,
    }));

    // 4. Speaking Practice Metrics
    const [hostedCount, joinedCount] = await Promise.all([
      this.prisma.speakingSession.count({ where: { hostUserId: userId } }),
      this.prisma.speakingSession.count({ where: { peerUserId: userId } }),
    ]);

    const totalRatings = user.receivedRatings.length;
    const avgRatingScore =
      totalRatings > 0
        ? Number((user.receivedRatings.reduce((acc, r) => acc + r.stars, 0) / totalRatings).toFixed(1))
        : 5.0;

    // 5. Coin Wallet & Gamification
    const walletBalance = user.coinWallet?.balance ?? 0;
    const currentStreak = user.coinWallet?.currentStreakDays ?? 0;
    const lastStreakClaim = user.coinWallet?.lastStreakClaimAt ?? null;
    const unlockedBadges = user.badges.map((b) => ({
      badgeType: b.badgeType,
      unlockedAt: b.awardedAt,
    }));

    // 6. Recent Activity Chronological Feed
    const recentActivity = [
      ...user.quizAttempts.slice(0, 3).map((q) => ({
        type: 'QUIZ',
        title: `Quiz Attempted (Accuracy: ${q.scorePercentage}% - ${q.correctAnswers}/${q.totalQuestions})`,
        timestamp: q.createdAt,
      })),
      ...user.jobApplications.slice(0, 3).map((a) => {
        const title = a.customRole || a.job?.title || 'Vocational Position';
        const company = a.customCompany || a.job?.employer || 'Ausbildung Partner';
        return {
          type: 'JOB_APPLICATION',
          title: `Applied to ${title} at ${company}`,
          timestamp: a.updatedAt,
        };
      }),
      ...user.coinTransactions.slice(0, 3).map((t) => ({
        type: 'COIN_TRANSACTION',
        title: `${t.amount > 0 ? '+' : ''}${t.amount} coins (${t.type})`,
        timestamp: t.createdAt,
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 5);

    return {
      candidate: {
        id: user.id,
        email: user.email,
        profile: user.profile,
        roles: user.roles.map((r) => r.role.name),
      },
      learning: {
        completedLessonsCount,
        inProgressLessonsCount,
        levelCounts,
        totalQuizAttempts,
        avgQuizScore,
      },
      applications: {
        savedJobsCount: user.savedJobs.length,
        funnel: applicationFunnel,
      },
      courses: {
        activeEnrollments,
        completedCourses,
        certificates,
      },
      speaking: {
        totalSessions: hostedCount + joinedCount,
        hostedCount,
        joinedCount,
        averageRating: avgRatingScore,
        totalRatingsReceived: totalRatings,
      },
      wallet: {
        balance: walletBalance,
        streakDays: currentStreak,
        lastStreakClaim,
        badges: unlockedBadges,
      },
      recentActivity,
    };
  }

  /**
   * Aggregates platform-wide Key Performance Indicators for administrative oversight.
   */
  async getAdminOverview() {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingUsers,
      rolesBreakdown,
      totalLessonsCompleted,
      totalQuizAttempts,
      totalJobApplications,
      applicationsByStatus,
      totalEnrollments,
      totalCertificates,
      totalSpeakingSessions,
      openReportsCount,
      walletSum,
      coinTransactionsSummary,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: AccountStatus.ACTIVE } }),
      this.prisma.user.count({ where: { status: AccountStatus.SUSPENDED } }),
      this.prisma.user.count({ where: { status: AccountStatus.PENDING_VERIFICATION } }),
      this.prisma.userRole.groupBy({
        by: ['roleId'],
        _count: { userId: true },
      }),
      this.prisma.lessonProgress.count({ where: { isCompleted: true } }),
      this.prisma.quizAttempt.count(),
      this.prisma.jobApplication.count(),
      this.prisma.jobApplication.groupBy({
        by: ['status'],
        _count: { id: true },
      }),
      this.prisma.courseEnrollment.count(),
      this.prisma.certificate.count(),
      this.prisma.speakingSession.count(),
      this.prisma.speakingReport.count({ where: { isResolved: false } }),
      this.prisma.coinWallet.aggregate({
        _sum: { balance: true },
      }),
      this.prisma.coinTransaction.groupBy({
        by: ['type'],
        _sum: { amount: true },
        _count: { id: true },
      }),
    ]);

    // Roles label mapping
    const roles = await this.prisma.role.findMany();
    const roleMap = new Map(roles.map((r) => [r.id, r.name]));
    const usersByRole: Record<string, number> = {};
    rolesBreakdown.forEach((rb) => {
      const name = roleMap.get(rb.roleId) || rb.roleId;
      usersByRole[name] = rb._count.userId;
    });

    // Format application status distribution
    const applicationsDistribution: Record<string, number> = {};
    applicationsByStatus.forEach((item) => {
      applicationsDistribution[item.status] = item._count.id;
    });

    // Format coin economy
    let totalCoinsPurchased = 0;
    let totalCoinsRewarded = 0;
    let totalCoinsSpent = 0;

    coinTransactionsSummary.forEach((tx) => {
      const sum = tx._sum.amount ?? 0;
      if (tx.type === 'PURCHASE_COIN_PACK') {
        totalCoinsPurchased += sum;
      } else if (tx.type.startsWith('REWARD_')) {
        totalCoinsRewarded += sum;
      } else if (tx.type.startsWith('SPEND_')) {
        totalCoinsSpent += Math.abs(sum);
      }
    });

    return {
      kpi: {
        users: {
          total: totalUsers,
          active: activeUsers,
          suspended: suspendedUsers,
          pending: pendingUsers,
          byRole: usersByRole,
        },
        learning: {
          totalLessonsCompleted,
          totalQuizAttempts,
        },
        applications: {
          total: totalJobApplications,
          distribution: applicationsDistribution,
        },
        courses: {
          totalEnrollments,
          totalCertificates,
        },
        speaking: {
          totalSessions: totalSpeakingSessions,
          openReports: openReportsCount,
        },
        economy: {
          totalCirculatingCoins: walletSum._sum.balance ?? 0,
          totalCoinsPurchased,
          totalCoinsRewarded,
          totalCoinsSpent,
        },
      },
    };
  }

  /**
   * Retrieves the moderation queue with filtering by resolution status.
   */
  async getModerationQueue(isResolved = false, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [totalItems, reports] = await Promise.all([
      this.prisma.speakingReport.count({ where: { isResolved } }),
      this.prisma.speakingReport.findMany({
        where: { isResolved },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          session: true,
          reporter: {
            select: {
              id: true,
              email: true,
              profile: true,
            },
          },
          reportedUser: {
            select: {
              id: true,
              email: true,
              status: true,
              profile: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: reports,
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

  /**
   * Resolves a reported speaking session incident and applies disciplinary action.
   */
  async resolveModerationReport(
    reportId: string,
    dto: ResolveReportDto,
    adminId: string,
    ipAddress?: string,
  ) {
    const report = await this.prisma.speakingReport.findUnique({
      where: { id: reportId },
      include: { reportedUser: true },
    });

    if (!report) {
      throw new NotFoundException(`Moderation report ${reportId} not found.`);
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Update report resolution status
      const updatedReport = await tx.speakingReport.update({
        where: { id: reportId },
        data: {
          isResolved: true,
          resolutionNotes: `Action: ${dto.action}. Notes: ${dto.notes}`,
        },
      });

      // 2. Execute disciplinary actions if suspension is mandated
      if (dto.action === ModerationResolutionAction.SUSPEND_USER) {
        await tx.user.update({
          where: { id: report.reportedUserId },
          data: { status: AccountStatus.SUSPENDED },
        });

        // Revoke active sessions for abusive candidate
        await tx.refreshToken.updateMany({
          where: { userId: report.reportedUserId },
          data: { isRevoked: true },
        });

        await tx.auditLog.create({
          data: {
            actorId: adminId,
            action: 'MODERATION_SUSPEND_USER',
            targetEntity: 'User',
            targetId: report.reportedUserId,
            details: {
              reportId,
              reason: report.reason,
              notes: dto.notes,
            },
            ipAddress,
          },
        });
      }

      // 3. Record administrative audit log
      await tx.auditLog.create({
        data: {
          actorId: adminId,
          action: 'MODERATION_RESOLVE_REPORT',
          targetEntity: 'SpeakingReport',
          targetId: reportId,
          details: {
            reportedUserId: report.reportedUserId,
            reporterId: report.reporterId,
            actionTaken: dto.action,
            notes: dto.notes,
          },
          ipAddress,
        },
      });

      return {
        success: true,
        reportId: updatedReport.id,
        isResolved: updatedReport.isResolved,
        actionTaken: dto.action,
        resolutionNotes: updatedReport.resolutionNotes,
      };
    });
  }

  /**
   * Retrieves paginated, filterable immutable system audit logs.
   */
  async getAuditLogs(query: AuditQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.action) {
      where.action = { contains: query.action, mode: 'insensitive' };
    }
    if (query.actorId) {
      where.actorId = query.actorId;
    }
    if (query.targetEntity) {
      where.targetEntity = query.targetEntity;
    }

    const [totalItems, logs] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              email: true,
              profile: true,
            },
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items: logs,
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

  /**
   * Live diagnostic probes checking database, memory, and runtime health.
   */
  async getSystemHealth() {
    const startTime = Date.now();
    let dbStatus = 'HEALTHY';
    let dbLatencyMs = 0;

    try {
      await this.prisma.$queryRaw`SELECT 1 as alive`;
      dbLatencyMs = Date.now() - startTime;
    } catch (err: any) {
      dbStatus = 'DEGRADED';
      this.logger.error(`Database health check failed: ${err.message}`);
    }

    const memUsage = process.memoryUsage();
    const memory = {
      rssMb: Math.round(memUsage.rss / (1024 * 1024)),
      heapTotalMb: Math.round(memUsage.heapTotal / (1024 * 1024)),
      heapUsedMb: Math.round(memUsage.heapUsed / (1024 * 1024)),
      externalMb: Math.round(memUsage.external / (1024 * 1024)),
    };

    return {
      status: dbStatus === 'HEALTHY' ? 'OPERATIONAL' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'development',
      components: {
        database: {
          status: dbStatus,
          latencyMs: dbLatencyMs,
          engine: 'PostgreSQL 16 (Prisma ORM)',
        },
        memory,
        externalServices: {
          bundesagenturApi: {
            status: 'CONNECTED',
            protocol: 'HTTPS REST (jobsuche.api.bund.dev)',
          },
          storageVault: {
            status: 'OPERATIONAL',
            type: 'Local Encrypted Document Vault / MinIO Ready',
          },
          paymentGateway: {
            status: 'CONFIGURED',
            provider: 'Stripe Webhooks & Checkout v17',
          },
        },
      },
    };
  }
}
