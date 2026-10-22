import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { CoinsService } from './coins.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  BadgeType,
  CoinTransactionType,
  OrderStatus,
} from '@prisma/client';
import { CoinPackageId } from './constants/coin-packages.constant.js';
import { BadRequestException } from '@nestjs/common';

describe('CoinsService (Phase 8 - Virtual Coin Economy, Gamification & Stripe)', () => {
  let coinsService: CoinsService;
  let prisma: PrismaService;
  let testUserId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [CoinsService],
    }).compile();

    coinsService = module.get<CoinsService>(CoinsService);
    prisma = module.get<PrismaService>(PrismaService);

    // Create a dedicated candidate user for economy testing
    const user = await prisma.user.create({
      data: {
        email: `coins-candidate-${Date.now()}@example.com`,
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Karim',
            lastName: 'Chowdhury',
            targetAusbildungField: 'Fachinformatiker',
          },
        },
      },
    });
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.delete({ where: { id: testUserId } }).catch(() => {});
    }
  });

  // ===========================================================================
  // 1. COIN WALLET & LEDGER INITIALIZATION
  // ===========================================================================
  describe('Coin Wallet Initialization & Ledger', () => {
    it('1. should create wallet with 100 free welcome coins and a welcome bonus transaction', async () => {
      const wallet = await coinsService.getOrCreateWallet(testUserId);

      expect(wallet).toBeDefined();
      expect(wallet.userId).toBe(testUserId);
      expect(wallet.balance).toBe(100);
      expect(wallet.totalEarned).toBe(100);
      expect(wallet.totalSpent).toBe(0);
      expect(wallet.transactions.length).toBeGreaterThanOrEqual(1);
      expect(wallet.transactions[0].type).toBe(CoinTransactionType.REWARD_WELCOME_BONUS);
    });

    it('2. should retrieve paginated transaction history', async () => {
      const history = await coinsService.getTransactionHistory(testUserId, 1, 10);
      expect(history.items).toBeDefined();
      expect(history.items.length).toBeGreaterThanOrEqual(1);
      expect(history.pagination.total).toBeGreaterThanOrEqual(1);
    });
  });

  // ===========================================================================
  // 2. DAILY LOGIN STREAKS & MILESTONE BADGES
  // ===========================================================================
  describe('Daily Login Streaks & Gamification', () => {
    it('1. should claim initial daily streak and award +15 coins', async () => {
      const claim = await coinsService.claimDailyStreak(testUserId);

      expect(claim.alreadyClaimedToday).toBe(false);
      expect(claim.coinsAwarded).toBe(15);
      expect(claim.currentStreakDays).toBe(1);
      expect(claim.newBalance).toBe(115);
    });

    it('2. should reject duplicate streak claim on the same day', async () => {
      const duplicateClaim = await coinsService.claimDailyStreak(testUserId);

      expect(duplicateClaim.alreadyClaimedToday).toBe(true);
      expect(duplicateClaim.coinsAwarded).toBe(0);
      expect(duplicateClaim.currentStreakDays).toBe(1);
    });

    it('3. should award milestone bonus and 7-Day badge when streak reaches 7', async () => {
      // Simulate streak at day 6 by manually updating wallet
      const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000); // 25 hours ago
      await prisma.coinWallet.update({
        where: { userId: testUserId },
        data: {
          currentStreakDays: 6,
          lastStreakClaimAt: yesterday,
        },
      });

      const day7Claim = await coinsService.claimDailyStreak(testUserId);

      expect(day7Claim.alreadyClaimedToday).toBe(false);
      expect(day7Claim.currentStreakDays).toBe(7);
      expect(day7Claim.coinsAwarded).toBe(65); // 15 base + 50 milestone bonus
      expect(day7Claim.badgesAwarded).toContain('STREAK_7_DAYS');

      // Verify badge created in user_badges table
      const badges = await coinsService.getUserBadges(testUserId);
      expect(badges.some((b) => b.badgeType === BadgeType.STREAK_7_DAYS)).toBe(true);
    });
  });

  // ===========================================================================
  // 3. CREDIT & SPEND OPERATIONS
  // ===========================================================================
  describe('Credit & Spend Transactions', () => {
    it('1. should credit coins for completing a German vocabulary quiz', async () => {
      const initialWallet = await coinsService.getOrCreateWallet(testUserId);
      const initialBalance = initialWallet.balance;

      const updated = await coinsService.creditCoins(
        testUserId,
        25,
        CoinTransactionType.REWARD_QUIZ,
        'Quiz B1 Vokabeln perfekt bestanden (100%)',
        'quiz-att-123',
      );

      expect(updated.balance).toBe(initialBalance + 25);
      expect(updated.transactions[0].type).toBe(CoinTransactionType.REWARD_QUIZ);
    });

    it('2. should spend coins to unlock a course or service', async () => {
      const initialWallet = await coinsService.getOrCreateWallet(testUserId);
      const initialBalance = initialWallet.balance;

      const spent = await coinsService.spendCoins(
        testUserId,
        50,
        CoinTransactionType.SPEND_MOCK_INTERVIEW,
        'Freischaltung Mock-Interview Simulation',
      );

      expect(spent.balance).toBe(initialBalance - 50);
      expect(spent.totalSpent).toBeGreaterThanOrEqual(50);
      expect(spent.transactions[0].amount).toBe(-50);
    });

    it('3. should reject spending when balance is insufficient', async () => {
      await expect(
        coinsService.spendCoins(
          testUserId,
          999999, // Way higher than balance
          CoinTransactionType.SPEND_COURSE,
          'Expensive item',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ===========================================================================
  // 4. STRIPE CHECKOUT & WEBHOOK FULFILLMENT
  // ===========================================================================
  describe('Stripe Checkout & Webhook Fulfillment', () => {
    let mockSessionId: string;

    it('1. should list coin packages with Euro pricing', () => {
      const packages = coinsService.getCoinPackages();
      expect(packages.length).toBe(3);
      expect(packages.some((p) => p.id === CoinPackageId.PRO_350)).toBe(true);
      expect(packages.find((p) => p.id === CoinPackageId.PRO_350)!.coins).toBe(350);
      expect(packages.find((p) => p.id === CoinPackageId.PRO_350)!.priceCents).toBe(1299);
    });

    it('2. should initiate a Stripe checkout session and record a PENDING order', async () => {
      const checkout = await coinsService.createStripeCheckoutSession(testUserId, {
        packageId: CoinPackageId.PRO_350,
        successUrl: 'http://localhost:3000/pricing?status=success',
        cancelUrl: 'http://localhost:3000/pricing?status=cancelled',
      });

      expect(checkout.sessionId).toBeDefined();
      expect(checkout.checkoutUrl).toContain('pricing?status=success');
      expect(checkout.coins).toBe(350);
      expect(checkout.amountCents).toBe(1299);

      mockSessionId = checkout.sessionId;

      // Verify order record in database
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: mockSessionId },
      });
      expect(order).toBeDefined();
      expect(order!.status).toBe(OrderStatus.PENDING);
    });

    it('3. should handle checkout.session.completed webhook and credit purchased coins', async () => {
      const walletBefore = await coinsService.getOrCreateWallet(testUserId);

      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: {
            id: mockSessionId,
            metadata: {
              userId: testUserId,
              packageId: CoinPackageId.PRO_350,
              coins: '350',
            },
          },
        },
      };

      const res = await coinsService.handleStripeWebhook(webhookPayload);
      expect(res.success).toBe(true);
      expect(res.creditedCoins).toBe(350);

      // Verify wallet balance incremented by 350
      const walletAfter = await coinsService.getOrCreateWallet(testUserId);
      expect(walletAfter.balance).toBe(walletBefore.balance + 350);

      // Verify order status updated to COMPLETED
      const order = await prisma.order.findFirst({
        where: { stripePaymentIntentId: mockSessionId },
      });
      expect(order!.status).toBe(OrderStatus.COMPLETED);

      // Verify replay attack protection: sending same webhook event again does not duplicate coins
      const replayRes = (await coinsService.handleStripeWebhook(webhookPayload)) as any;
      expect(replayRes.alreadyFulfilled).toBe(true); // existingTx prevented duplicate

      const walletAfterReplay = await coinsService.getOrCreateWallet(testUserId);
      expect(walletAfterReplay.balance).toBe(walletAfter.balance);
    });
  });

  // ===========================================================================
  // 5. ADMIN ADJUSTMENT & BADGES
  // ===========================================================================
  describe('Admin Operations & Badges', () => {
    it('1. should allow admin to adjust coins with reason note', async () => {
      const walletBefore = await coinsService.getOrCreateWallet(testUserId);

      await coinsService.adminAdjustCoins({
        userId: testUserId,
        amount: 50,
        reason: 'Kulanzgutschrift nach Fehler',
      });

      const walletAfter = await coinsService.getOrCreateWallet(testUserId);
      expect(walletAfter.balance).toBe(walletBefore.balance + 50);
    });

    it('2. should award and list user achievement badges', async () => {
      await coinsService.awardBadge(
        testUserId,
        BadgeType.SPEAKING_CHAMPION,
        'Tandem Champion',
        'Erstes Vorstellungsgespräch auf Deutsch simuliert!',
        'Video',
      );

      const badges = await coinsService.getUserBadges(testUserId);
      expect(badges.length).toBeGreaterThanOrEqual(2); // STREAK_7_DAYS + SPEAKING_CHAMPION
      expect(badges.some((b) => b.badgeType === BadgeType.SPEAKING_CHAMPION)).toBe(true);
    });
  });
});
