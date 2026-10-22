import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { CoinsService } from '../coins/coins.service.js';
import { DashboardService } from '../dashboard/dashboard.service.js';
import { ToolkitService } from '../toolkit/toolkit.service.js';
import { ModerationResolutionAction } from '../dashboard/dto/resolve-report.dto.js';
import { AccountStatus } from '../../common/common.constants.js';

describe('Phase 10: Security, Quality & Performance Hardening Test Suite', () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
        count: vi.fn(),
      },
      userRole: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      coinWallet: {
        findUnique: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      },
      coinTransaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        findFirst: vi.fn(),
      },
      cvVersion: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      speakingReport: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      refreshToken: {
        updateMany: vi.fn(),
      },
      auditLog: {
        create: vi.fn(),
      },
      $transaction: vi.fn((cb: any) => {
        if (typeof cb === 'function') {
          return cb(mockPrisma);
        }
        return Promise.all(cb);
      }),
    };
  });

  describe('1. IDOR / Insecure Direct Object Reference Mitigation', () => {
    it('should strictly reject access to another user\'s CV with NotFoundException', async () => {
      const toolkitService = new ToolkitService(mockPrisma);

      // Attempting to access CV belonging to victim-user-id with attacker-user-id
      mockPrisma.cvVersion.findFirst.mockResolvedValue(null);

      await expect(
        toolkitService.getCvById('attacker-user-id', 'cv-uuid-999'),
      ).rejects.toThrow(NotFoundException);

      expect(mockPrisma.cvVersion.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cv-uuid-999',
          userId: 'attacker-user-id',
        },
      });
    });

    it('should prevent deleting another user\'s CV document', async () => {
      const toolkitService = new ToolkitService(mockPrisma);

      mockPrisma.cvVersion.findFirst.mockResolvedValue(null);

      await expect(
        toolkitService.deleteCv('attacker-user-id', 'cv-uuid-999'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('2. Financial Concurrency & Double-Spending Prevention', () => {
    it('should reject spending coins when balance is insufficient (Negative Balance Check)', async () => {
      const coinsService = new CoinsService(mockPrisma);

      mockPrisma.coinWallet.findUnique.mockResolvedValue({
        id: 'wallet-1',
        userId: 'candidate-1',
        balance: 50,
      });

      await expect(
        coinsService.spendCoins(
          'candidate-1',
          100, // Demands 100 but only has 50
          'SPEND_COURSE' as any,
          'Attempted double spending',
        ),
      ).rejects.toThrow(BadRequestException);

      // Verify wallet was NOT decremented into negative
      expect(mockPrisma.coinWallet.update).not.toHaveBeenCalled();
    });

    it('should atomicaly process valid coin expenditure with exact balance decrement inside transaction', async () => {
      const coinsService = new CoinsService(mockPrisma);

      mockPrisma.coinWallet.findUnique.mockResolvedValue({
        id: 'wallet-1',
        userId: 'candidate-1',
        balance: 200,
        totalSpent: 50,
      });

      mockPrisma.coinWallet.update.mockResolvedValue({
        id: 'wallet-1',
        userId: 'candidate-1',
        balance: 100,
        totalSpent: 150,
      });

      mockPrisma.coinTransaction.create.mockResolvedValue({
        id: 'tx-1',
        walletId: 'wallet-1',
        userId: 'candidate-1',
        amount: -100,
        balanceAfter: 100,
      });

      const result = await coinsService.spendCoins(
        'candidate-1',
        100,
        'SPEND_COURSE' as any,
        'Vocational Course Enrollment',
      );

      expect(result.balance).toBe(100);
      expect(mockPrisma.coinWallet.update).toHaveBeenCalledWith({
        where: { userId: 'candidate-1' },
        data: {
          balance: { decrement: 100 },
          totalSpent: { increment: 100 },
          transactions: {
            create: {
              userId: 'candidate-1',
              amount: -100,
              balanceAfter: 100,
              type: 'SPEND_COURSE',
              description: 'Vocational Course Enrollment',
              referenceId: undefined,
            },
          },
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    });
  });

  describe('3. Least-Privilege & Moderation Escalation Guarding', () => {
    it('should revoke active sessions and create audit trail when suspending an abusive candidate', async () => {
      const dashboardService = new DashboardService(mockPrisma);

      mockPrisma.speakingReport.findUnique.mockResolvedValue({
        id: 'rep-88',
        reportedUserId: 'toxic-user-1',
        reporterId: 'reporter-1',
        reason: 'HARASSMENT',
        details: 'Offensive language',
        reportedUser: { id: 'toxic-user-1', status: 'ACTIVE' },
      });

      mockPrisma.speakingReport.update.mockResolvedValue({
        id: 'rep-88',
        isResolved: true,
        resolutionNotes: 'Action: SUSPEND_USER. Notes: Permanent ban.',
      });

      mockPrisma.user.update.mockResolvedValue({
        id: 'toxic-user-1',
        status: AccountStatus.SUSPENDED,
      });

      mockPrisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });
      mockPrisma.auditLog.create.mockResolvedValue({ id: 'aud-1' });

      const res = await dashboardService.resolveModerationReport(
        'rep-88',
        { action: ModerationResolutionAction.SUSPEND_USER, notes: 'Permanent ban.' },
        'admin-uuid',
        '203.0.113.195',
      );

      expect(res.success).toBe(true);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'toxic-user-1' },
        data: { status: AccountStatus.SUSPENDED },
      });
      expect(mockPrisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'toxic-user-1' },
        data: { isRevoked: true },
      });
      expect(mockPrisma.auditLog.create).toHaveBeenCalledTimes(2);
    });
  });

  describe('4. Stripe Webhook Idempotency & Replay Protection', () => {
    it('should reject replaying an already-fulfilled Stripe checkout session', async () => {
      const coinsService = new CoinsService(mockPrisma);

      // Existing transaction already found with this session ID
      mockPrisma.coinTransaction.findFirst.mockResolvedValue({
        id: 'tx-existing',
        referenceId: 'cs_test_already_processed',
      });

      const res = await coinsService.handleStripeWebhook({
        id: 'evt_test_replay',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_already_processed',
            metadata: { userId: 'user-1', packageId: 'STARTER_100', coins: '100' },
          },
        },
      } as any);

      expect(res.alreadyFulfilled).toBe(true);
      expect(mockPrisma.coinWallet.update).not.toHaveBeenCalled();
    });
  });
});
