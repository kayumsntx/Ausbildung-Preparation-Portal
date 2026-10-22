import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  BadgeType,
  CoinTransactionType,
  OrderStatus,
  PaymentMethod,
} from '@prisma/client';
import {
  COIN_PACKAGES,
  CoinPackageId,
} from './constants/coin-packages.constant.js';
import { CreateCheckoutDto } from './dto/checkout.dto.js';
import { AdminAdjustCoinsDto } from './dto/admin-adjust.dto.js';

@Injectable()
export class CoinsService {
  private stripeClient?: Stripe;

  constructor(private readonly prisma: PrismaService) {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (stripeKey && !stripeKey.includes('placeholder')) {
      this.stripeClient = new Stripe(stripeKey, {
        apiVersion: '2025-02-24.acacia' as any,
      });
    }
  }

  // ===========================================================================
  // 1. COIN WALLET & LEDGER
  // ===========================================================================

  async getOrCreateWallet(userId: string) {
    let wallet = await this.prisma.coinWallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!wallet) {
      wallet = await this.prisma.coinWallet.create({
        data: {
          userId,
          balance: 100, // 100 Free Welcome Coins
          totalEarned: 100,
          totalSpent: 0,
          currentStreakDays: 1,
          highestStreakDays: 1,
          lastStreakClaimAt: null,
          transactions: {
            create: {
              userId,
              amount: 100,
              balanceAfter: 100,
              type: CoinTransactionType.REWARD_WELCOME_BONUS,
              description: '100 Willkommens-Coins für deinen Ausbildungs-Start!',
            },
          },
        },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      });
    }

    return wallet;
  }

  async getTransactionHistory(
    userId: string,
    page = 1,
    limit = 20,
    type?: CoinTransactionType,
  ) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.coinTransaction.findMany({
        where: {
          userId,
          ...(type && { type }),
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.coinTransaction.count({
        where: {
          userId,
          ...(type && { type }),
        },
      }),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ===========================================================================
  // 2. DAILY LOGIN STREAKS & GAMIFICATION MILESTONES
  // ===========================================================================

  async claimDailyStreak(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    const now = new Date();

    if (wallet.lastStreakClaimAt) {
      const elapsedHours =
        (now.getTime() - wallet.lastStreakClaimAt.getTime()) / (1000 * 60 * 60);

      // Check if already claimed within the last 20 hours (same calendar day)
      if (elapsedHours < 20) {
        return {
          alreadyClaimedToday: true,
          currentStreakDays: wallet.currentStreakDays,
          highestStreakDays: wallet.highestStreakDays,
          nextClaimInHours: Math.max(1, Math.round(24 - elapsedHours)),
          coinsAwarded: 0,
          balance: wallet.balance,
          message: 'Du hast deinen heutigen Streak-Bonus bereits abgeholt!',
        };
      }
    }

    // Determine streak increment or reset
    let newStreak = 1;
    if (wallet.lastStreakClaimAt) {
      const elapsedHours =
        (now.getTime() - wallet.lastStreakClaimAt.getTime()) / (1000 * 60 * 60);
      if (elapsedHours <= 48) {
        newStreak = wallet.currentStreakDays + 1;
      } else {
        newStreak = 1; // Streak broken after 48h
      }
    }

    // Base reward: 15 Coins
    let coinsAwarded = 15;
    const badgesAwarded: string[] = [];

    // Milestone: 7-Day Streak (+50 bonus coins)
    if (newStreak === 7) {
      coinsAwarded += 50;
      await this.awardBadge(
        userId,
        BadgeType.STREAK_7_DAYS,
        '7-Tage-Lernserie',
        'Eine ganze Woche täglich Deutsch gelernt und geübt!',
        'Flame',
      );
      badgesAwarded.push('STREAK_7_DAYS');
    }

    // Milestone: 30-Day Streak (+250 bonus coins)
    if (newStreak === 30) {
      coinsAwarded += 250;
      await this.awardBadge(
        userId,
        BadgeType.STREAK_30_DAYS,
        '30-Tage Meister',
        'Einen ganzen Monat kontinuierlich auf die Ausbildung vorbereitet!',
        'Award',
      );
      badgesAwarded.push('STREAK_30_DAYS');
    }

    const newHighest = Math.max(wallet.highestStreakDays, newStreak);
    const newBalance = wallet.balance + coinsAwarded;

    // Update wallet and record transaction
    await this.prisma.coinWallet.update({
      where: { userId },
      data: {
        balance: { increment: coinsAwarded },
        totalEarned: { increment: coinsAwarded },
        currentStreakDays: newStreak,
        highestStreakDays: newHighest,
        lastStreakClaimAt: now,
        transactions: {
          create: {
            userId,
            amount: coinsAwarded,
            balanceAfter: newBalance,
            type: CoinTransactionType.REWARD_DAILY_STREAK,
            description: `Täglicher Streak-Bonus (Tag ${newStreak}): +${coinsAwarded} Coins`,
          },
        },
      },
    });

    return {
      alreadyClaimedToday: false,
      currentStreakDays: newStreak,
      highestStreakDays: newHighest,
      coinsAwarded,
      newBalance,
      badgesAwarded,
      message: `Toll gemacht! +${coinsAwarded} Ausbildungs-Coins gutgeschrieben.`,
    };
  }

  // ===========================================================================
  // 3. CREDIT & DEBIT OPERATIONS (INTERNAL & INTER-MODULE)
  // ===========================================================================

  async creditCoins(
    userId: string,
    amount: number,
    type: CoinTransactionType,
    description: string,
    referenceId?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Credit amount must be greater than zero.');
    }

    const wallet = await this.getOrCreateWallet(userId);
    const newBalance = wallet.balance + amount;
    const newTotalEarned = wallet.totalEarned + amount;

    const updated = await this.prisma.coinWallet.update({
      where: { userId },
      data: {
        balance: { increment: amount },
        totalEarned: { increment: amount },
        transactions: {
          create: {
            userId,
            amount,
            balanceAfter: newBalance,
            type,
            description,
            referenceId,
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

    // Check Coin Collector Badge milestone (500 coins earned)
    if (newTotalEarned >= 500) {
      await this.awardBadge(
        userId,
        BadgeType.COIN_COLLECTOR,
        'Coin Sammler',
        'Über 500 Ausbildungs-Coins durch fleißiges Lernen gesammelt!',
        'Coins',
      );
    }

    return updated;
  }

  async spendCoins(
    userId: string,
    amount: number,
    type: CoinTransactionType,
    description: string,
    referenceId?: string,
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Spend amount must be greater than zero.');
    }

    const wallet = await this.getOrCreateWallet(userId);

    if (wallet.balance < amount) {
      throw new BadRequestException(
        `Nicht genügend Coins vorhanden. Benötigt: ${amount} Coins, Aktuelles Guthaben: ${wallet.balance} Coins.`,
      );
    }

    const newBalance = wallet.balance - amount;

    return this.prisma.coinWallet.update({
      where: { userId },
      data: {
        balance: { decrement: amount },
        totalSpent: { increment: amount },
        transactions: {
          create: {
            userId,
            amount: -amount,
            balanceAfter: newBalance,
            type,
            description,
            referenceId,
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
  }

  // ===========================================================================
  // 4. STRIPE CHECKOUT GATEWAY & WEBHOOK
  // ===========================================================================

  getCoinPackages() {
    return Object.values(COIN_PACKAGES);
  }

  async createStripeCheckoutSession(userId: string, dto: CreateCheckoutDto) {
    const pkg = COIN_PACKAGES[dto.packageId];
    if (!pkg) {
      throw new NotFoundException(`Coin package '${dto.packageId}' does not exist.`);
    }

    const idempotencyKey =
      dto.idempotencyKey || `idem_pack_${dto.packageId}_${userId}_${Date.now()}`;

    // Verify user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, profile: { select: { firstName: true, lastName: true } } },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const successUrl =
      dto.successUrl ||
      `${process.env.APP_URL || 'http://localhost:3000'}/pricing?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl =
      dto.cancelUrl ||
      `${process.env.APP_URL || 'http://localhost:3000'}/pricing?checkout=cancelled`;

    let sessionId: string;
    let checkoutUrl: string;

    if (this.stripeClient) {
      const session = await this.stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: pkg.name,
                description: `${pkg.coins} Ausbildungs-Coins für Sprachpraxis & Fachkurse`,
              },
              unit_amount: pkg.priceCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        customer_email: user.email,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          packageId: pkg.id,
          coins: String(pkg.coins),
        },
      } as any);

      sessionId = session.id;
      checkoutUrl = session.url || successUrl;
    } else {
      // Deterministic Sandbox / Mock Stripe Checkout Session
      sessionId = `cs_test_${randomUUID().replace(/-/g, '')}`;
      checkoutUrl = `${successUrl.replace('{CHECKOUT_SESSION_ID}', sessionId)}&mock=true`;
    }

    // Record order in database
    await this.prisma.order.upsert({
      where: { idempotencyKey },
      update: {
        amountCents: pkg.priceCents,
        coinsAmount: pkg.coins,
        stripePaymentIntentId: sessionId,
      },
      create: {
        userId,
        amountCents: pkg.priceCents,
        coinsAmount: pkg.coins,
        paymentMethod: PaymentMethod.STRIPE,
        status: OrderStatus.PENDING,
        stripePaymentIntentId: sessionId,
        idempotencyKey,
      },
    });

    return {
      sessionId,
      checkoutUrl,
      package: pkg,
      amountCents: pkg.priceCents,
      coins: pkg.coins,
    };
  }

  async handleStripeWebhook(payload: any, signature?: string) {
    let event: any;

    if (this.stripeClient && process.env.STRIPE_WEBHOOK_SECRET && signature) {
      try {
        event = this.stripeClient.webhooks.constructEvent(
          payload,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET,
        );
      } catch (err: any) {
        throw new BadRequestException(`Webhook signature verification failed: ${err.message}`);
      }
    } else {
      // In test mode or when payload is parsed JSON directly
      event = typeof payload === 'string' ? JSON.parse(payload) : payload;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data?.object;
      const userId = session?.metadata?.userId;
      const packageId = session?.metadata?.packageId as CoinPackageId;
      const coins = parseInt(session?.metadata?.coins || '0', 10);
      const sessionId = session?.id;

      if (userId && coins > 0) {
        // Prevent duplicate fulfillment
        const existingTx = await this.prisma.coinTransaction.findFirst({
          where: { referenceId: sessionId },
        });

        if (existingTx) {
          return { received: true, alreadyFulfilled: true };
        }

        await this.creditCoins(
          userId,
          coins,
          CoinTransactionType.PURCHASE_COIN_PACK,
          `Kauf von ${coins} Ausbildungs-Coins (${packageId || 'Coin Pack'})`,
          sessionId,
        );

        if (sessionId) {
          await this.prisma.order.updateMany({
            where: { stripePaymentIntentId: sessionId },
            data: { status: OrderStatus.COMPLETED },
          });
        }

        return { success: true, creditedCoins: coins, userId };
      }
    }

    return { received: true };
  }

  // ===========================================================================
  // 5. ADMIN & BADGES
  // ===========================================================================

  async adminAdjustCoins(dto: AdminAdjustCoinsDto) {
    if (dto.amount >= 0) {
      return this.creditCoins(
        dto.userId,
        dto.amount,
        CoinTransactionType.ADMIN_ADJUSTMENT,
        `Admin-Gutschrift: ${dto.reason}`,
      );
    } else {
      return this.spendCoins(
        dto.userId,
        Math.abs(dto.amount),
        CoinTransactionType.ADMIN_ADJUSTMENT,
        `Admin-Abbuchung: ${dto.reason}`,
      );
    }
  }

  async getUserBadges(userId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId },
      orderBy: { awardedAt: 'desc' },
    });
  }

  async awardBadge(
    userId: string,
    badgeType: BadgeType,
    title: string,
    description: string,
    icon = 'Award',
  ) {
    const existing = await this.prisma.userBadge.findUnique({
      where: { userId_badgeType: { userId, badgeType } },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.userBadge.create({
      data: {
        userId,
        badgeType,
        title,
        description,
        icon,
      },
    });
  }
}
