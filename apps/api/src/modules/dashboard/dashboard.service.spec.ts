import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException } from '@nestjs/common';
import { DashboardService } from './dashboard.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ModerationResolutionAction } from './dto/resolve-report.dto.js';
import { AccountStatus } from '../../common/common.constants.js';

describe('DashboardService (Phase 9 - Unified Dashboards & Administration)', () => {
  let service: DashboardService;
  let prisma: any;

  beforeEach(() => {
    prisma = {
      user: {
        findUnique: vi.fn(),
        count: vi.fn(),
        update: vi.fn(),
      },
      userRole: {
        groupBy: vi.fn(),
      },
      role: {
        findMany: vi.fn(),
      },
      speakingSession: {
        count: vi.fn(),
      },
      speakingReport: {
        count: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      lessonProgress: {
        count: vi.fn(),
      },
      quizAttempt: {
        count: vi.fn(),
      },
      jobApplication: {
        count: vi.fn(),
        groupBy: vi.fn(),
      },
      courseEnrollment: {
        count: vi.fn(),
      },
      certificate: {
        count: vi.fn(),
      },
      coinWallet: {
        aggregate: vi.fn(),
      },
      coinTransaction: {
        groupBy: vi.fn(),
      },
      refreshToken: {
        updateMany: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
        count: vi.fn(),
        findMany: vi.fn(),
      },
      $queryRaw: vi.fn(),
      $transaction: vi.fn((cb: any) => {
        if (typeof cb === 'function') {
          return cb(prisma);
        }
        return Promise.all(cb);
      }),
    };

    service = new DashboardService(prisma as unknown as PrismaService);
  });

  describe('getStudentDashboard', () => {
    it('1. should throw NotFoundException if candidate is not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getStudentDashboard('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('2. should aggregate student metrics across learning, jobs, courses, speaking and coins', async () => {
      const mockUser = {
        id: 'student-1',
        email: 'candidate@example.de',
        profile: { firstName: 'Rahim', lastName: 'Khan' },
        roles: [{ role: { name: 'STUDENT' } }],
        coinWallet: { balance: 450, currentStreakDays: 7, lastStreakClaimAt: new Date() },
        badges: [{ badgeType: 'STREAK_7_DAYS', awardedAt: new Date() }],
        lessonProgress: [
          {
            isCompleted: true,
            lesson: { module: { level: { code: 'A1' } } },
          },
          {
            isCompleted: true,
            lesson: { module: { level: { code: 'A1' } } },
          },
          {
            isCompleted: false,
            lesson: { module: { level: { code: 'A2' } } },
          },
        ],
        quizAttempts: [
          { scorePercentage: 90, totalQuestions: 10, correctAnswers: 9, createdAt: new Date() },
          { scorePercentage: 80, totalQuestions: 10, correctAnswers: 8, createdAt: new Date() },
        ],
        savedJobs: [{ id: 'job-1' }, { id: 'job-2' }],
        jobApplications: [
          { status: 'APPLIED', customRole: 'Pflegefachkraft', customCompany: 'Charité', updatedAt: new Date(), job: null },
          { status: 'INTERVIEW', customRole: 'Fachinformatiker', customCompany: 'SAP', updatedAt: new Date(), job: null },
        ],
        courseEnrollments: [
          { status: 'ACTIVE', course: { title: 'Nursing German' } },
          { status: 'COMPLETED', course: { title: 'German Workplace Culture' } },
        ],
        certificates: [
          {
            id: 'cert-1',
            certificateCode: 'CERT-1234-ABCD',
            verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            issuedAt: new Date(),
            courseTitle: 'German Workplace Culture',
            course: { title: 'German Workplace Culture' },
          },
        ],
        receivedRatings: [
          { stars: 5 },
          { stars: 4 },
        ],
        coinTransactions: [
          { type: 'REWARD_QUIZ', amount: 20, createdAt: new Date() },
        ],
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);
      prisma.speakingSession.count.mockResolvedValueOnce(3); // hosted
      prisma.speakingSession.count.mockResolvedValueOnce(5); // joined

      const result = await service.getStudentDashboard('student-1');

      expect(result.candidate.email).toBe('candidate@example.de');
      expect(result.learning.completedLessonsCount).toBe(2);
      expect(result.learning.inProgressLessonsCount).toBe(1);
      expect(result.learning.levelCounts.A1).toBe(2);
      expect(result.learning.avgQuizScore).toBe(85); // (90 + 80) / 2
      expect(result.applications.savedJobsCount).toBe(2);
      expect(result.applications.funnel.APPLIED).toBe(1);
      expect(result.applications.funnel.INTERVIEW).toBe(1);
      expect(result.applications.funnel.total).toBe(2);
      expect(result.courses.activeEnrollments).toBe(1);
      expect(result.courses.completedCourses).toBe(1);
      expect(result.courses.certificates).toHaveLength(1);
      expect(result.speaking.hostedCount).toBe(3);
      expect(result.speaking.joinedCount).toBe(5);
      expect(result.speaking.averageRating).toBe(4.5);
      expect(result.wallet.balance).toBe(450);
      expect(result.wallet.streakDays).toBe(7);
      expect(result.recentActivity.length).toBeGreaterThan(0);
    });
  });

  describe('getAdminOverview', () => {
    it('3. should aggregate global platform KPIs including users, learning, applications and economy', async () => {
      prisma.user.count
        .mockResolvedValueOnce(120) // total
        .mockResolvedValueOnce(110) // active
        .mockResolvedValueOnce(5)   // suspended
        .mockResolvedValueOnce(5);  // pending

      prisma.userRole.groupBy.mockResolvedValue([
        { roleId: 'role-student', _count: { userId: 100 } },
        { roleId: 'role-admin', _count: { userId: 2 } },
      ]);

      prisma.role.findMany.mockResolvedValue([
        { id: 'role-student', name: 'STUDENT' },
        { id: 'role-admin', name: 'ADMIN' },
      ]);

      prisma.lessonProgress.count.mockResolvedValue(450);
      prisma.quizAttempt.count.mockResolvedValue(320);
      prisma.jobApplication.count.mockResolvedValue(85);
      prisma.jobApplication.groupBy.mockResolvedValue([
        { status: 'APPLIED', _count: { id: 50 } },
        { status: 'INTERVIEW', _count: { id: 20 } },
        { status: 'OFFER', _count: { id: 15 } },
      ]);
      prisma.courseEnrollment.count.mockResolvedValue(64);
      prisma.certificate.count.mockResolvedValue(30);
      prisma.speakingSession.count.mockResolvedValue(150);
      prisma.speakingReport.count.mockResolvedValue(2);
      prisma.coinWallet.aggregate.mockResolvedValue({ _sum: { balance: 25400 } });
      prisma.coinTransaction.groupBy.mockResolvedValue([
        { type: 'PURCHASE_COIN_PACK', _sum: { amount: 15000 }, _count: { id: 30 } },
        { type: 'REWARD_QUIZ', _sum: { amount: 8000 }, _count: { id: 400 } },
        { type: 'SPEND_COURSE', _sum: { amount: -5000 }, _count: { id: 20 } },
      ]);

      const result = await service.getAdminOverview();

      expect(result.kpi.users.total).toBe(120);
      expect(result.kpi.users.active).toBe(110);
      expect(result.kpi.users.suspended).toBe(5);
      expect(result.kpi.users.byRole.STUDENT).toBe(100);
      expect(result.kpi.learning.totalLessonsCompleted).toBe(450);
      expect(result.kpi.applications.distribution.APPLIED).toBe(50);
      expect(result.kpi.courses.totalCertificates).toBe(30);
      expect(result.kpi.speaking.totalSessions).toBe(150);
      expect(result.kpi.speaking.openReports).toBe(2);
      expect(result.kpi.economy.totalCirculatingCoins).toBe(25400);
      expect(result.kpi.economy.totalCoinsPurchased).toBe(15000);
      expect(result.kpi.economy.totalCoinsRewarded).toBe(8000);
      expect(result.kpi.economy.totalCoinsSpent).toBe(5000);
    });
  });

  describe('getModerationQueue', () => {
    it('4. should list open moderation reports with reporter and reported user details', async () => {
      prisma.speakingReport.count.mockResolvedValue(1);
      prisma.speakingReport.findMany.mockResolvedValue([
        {
          id: 'report-1',
          sessionId: 'session-123',
          reason: 'INAPPROPRIATE_LANGUAGE',
          details: 'Used offensive slurs during conversation',
          isResolved: false,
          reporter: { id: 'user-1', email: 'reporter@example.de' },
          reportedUser: { id: 'user-2', email: 'abusive@example.de', status: 'ACTIVE' },
          session: { roomId: 'room-123', targetLevel: 'B1' },
          createdAt: new Date(),
        },
      ]);

      const result = await service.getModerationQueue(false, 1, 10);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].reportedUser.email).toBe('abusive@example.de');
      expect(result.pagination.totalItems).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });
  });

  describe('resolveModerationReport', () => {
    it('5. should throw NotFoundException if report is missing', async () => {
      prisma.speakingReport.findUnique.mockResolvedValue(null);

      await expect(
        service.resolveModerationReport(
          'non-existent-report',
          { action: ModerationResolutionAction.DISMISS, notes: 'False report' },
          'admin-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('6. should resolve report and suspend abusive candidate with session revocation and audit logging', async () => {
      const mockReport = {
        id: 'rep-1',
        reportedUserId: 'abusive-user-99',
        reporterId: 'victim-user-11',
        reason: 'HARASSMENT',
        details: 'Verbal harassment',
        reportedUser: { id: 'abusive-user-99', status: 'ACTIVE' },
      };

      prisma.speakingReport.findUnique.mockResolvedValue(mockReport);
      prisma.speakingReport.update.mockResolvedValue({
        id: 'rep-1',
        isResolved: true,
        resolutionNotes: 'Action: SUSPEND_USER. Notes: Confirmed violation.',
      });
      prisma.user.update.mockResolvedValue({ id: 'abusive-user-99', status: AccountStatus.SUSPENDED });
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 2 });
      prisma.auditLog.create.mockResolvedValue({ id: 'audit-1' });

      const result = await service.resolveModerationReport(
        'rep-1',
        { action: ModerationResolutionAction.SUSPEND_USER, notes: 'Confirmed violation.' },
        'admin-1',
        '127.0.0.1',
      );

      expect(result.success).toBe(true);
      expect(result.isResolved).toBe(true);
      expect(result.actionTaken).toBe(ModerationResolutionAction.SUSPEND_USER);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'abusive-user-99' },
        data: { status: AccountStatus.SUSPENDED },
      });
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'abusive-user-99' },
        data: { isRevoked: true },
      });
      expect(prisma.auditLog.create).toHaveBeenCalledTimes(2); // One for user suspension, one for report resolution
    });

    it('7. should dismiss report without suspending user when action is DISMISS', async () => {
      const mockReport = {
        id: 'rep-2',
        reportedUserId: 'candidate-5',
        reporterId: 'candidate-6',
        reason: 'OTHER',
        details: 'Accidental disconnect',
        reportedUser: { id: 'candidate-5', status: 'ACTIVE' },
      };

      prisma.speakingReport.findUnique.mockResolvedValue(mockReport);
      prisma.speakingReport.update.mockResolvedValue({
        id: 'rep-2',
        isResolved: true,
        resolutionNotes: 'Action: DISMISS. Notes: Connection drop, no violation.',
      });

      const result = await service.resolveModerationReport(
        'rep-2',
        { action: ModerationResolutionAction.DISMISS, notes: 'Connection drop, no violation.' },
        'admin-1',
      );

      expect(result.success).toBe(true);
      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(prisma.refreshToken.updateMany).not.toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalledTimes(1); // One for report resolution
    });
  });

  describe('getAuditLogs', () => {
    it('8. should return paginated audit logs with action filters', async () => {
      prisma.auditLog.count.mockResolvedValue(1);
      prisma.auditLog.findMany.mockResolvedValue([
        {
          id: 'log-1',
          actorId: 'admin-1',
          action: 'MODERATION_SUSPEND_USER',
          targetEntity: 'User',
          targetId: 'user-99',
          createdAt: new Date(),
          actor: { id: 'admin-1', email: 'admin@ausbildung.de' },
        },
      ]);

      const result = await service.getAuditLogs({
        page: 1,
        limit: 10,
        action: 'MODERATION_SUSPEND_USER',
      });

      expect(result.items).toHaveLength(1);
      expect(result.items[0].action).toBe('MODERATION_SUSPEND_USER');
      expect(result.pagination.totalItems).toBe(1);
    });
  });

  describe('getSystemHealth', () => {
    it('9. should probe database latency and return operational system status', async () => {
      prisma.$queryRaw.mockResolvedValue([{ alive: 1 }]);

      const health = await service.getSystemHealth();

      expect(health.status).toBe('OPERATIONAL');
      expect(health.components.database.status).toBe('HEALTHY');
      expect(health.components.database.latencyMs).toBeGreaterThanOrEqual(0);
      expect(health.components.memory.rssMb).toBeGreaterThan(0);
      expect(health.components.externalServices.bundesagenturApi.status).toBe('CONNECTED');
    });

    it('10. should report DEGRADED status when database ping fails', async () => {
      prisma.$queryRaw.mockRejectedValue(new Error('Connection timeout'));

      const health = await service.getSystemHealth();

      expect(health.status).toBe('DEGRADED');
      expect(health.components.database.status).toBe('DEGRADED');
    });
  });
});
