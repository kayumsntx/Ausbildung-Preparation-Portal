import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoinsService } from './coins.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';
import { CreateCheckoutDto } from './dto/checkout.dto.js';
import { AdminAdjustCoinsDto } from './dto/admin-adjust.dto.js';
import { CoinTransactionType } from '@prisma/client';
import { RoleType } from '../../common/common.constants.js';

@ApiTags('Coins & Gamification Economy')
@Controller('coins')
export class CoinsController {
  constructor(private readonly coinsService: CoinsService) {}

  // ===========================================================================
  // 1. WALLET & TRANSACTIONS
  // ===========================================================================

  @Get('wallet')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user virtual coin wallet, balance, and streak status' })
  @ApiResponse({ status: 200, description: 'Coin wallet returned.' })
  async getWallet(@CurrentUser() user: CurrentUserPayload) {
    return this.coinsService.getOrCreateWallet(user.userId);
  }

  @Get('transactions')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get paginated immutable coin ledger transactions' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiQuery({ name: 'type', enum: CoinTransactionType, required: false })
  async getTransactions(
    @CurrentUser() user: CurrentUserPayload,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: CoinTransactionType,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 20;
    return this.coinsService.getTransactionHistory(user.userId, pageNum, limitNum, type);
  }

  // ===========================================================================
  // 2. DAILY LOGIN STREAKS
  // ===========================================================================

  @Post('claim-streak')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Claim daily login streak bonus (+15 coins + milestone achievements)' })
  @ApiResponse({ status: 200, description: 'Streak claimed or already claimed today.' })
  async claimStreak(@CurrentUser() user: CurrentUserPayload) {
    return this.coinsService.claimDailyStreak(user.userId);
  }

  // ===========================================================================
  // 3. PACKAGES & STRIPE CHECKOUT
  // ===========================================================================

  @Get('packages')
  @ApiOperation({ summary: 'List available virtual coin packages and pricing in EUR' })
  async getPackages() {
    return this.coinsService.getCoinPackages();
  }

  @Post('checkout')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Initiate Stripe card checkout for purchasing virtual coin packs' })
  @ApiResponse({ status: 201, description: 'Stripe checkout session created.' })
  async createCheckout(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateCheckoutDto,
  ) {
    return this.coinsService.createStripeCheckoutSession(user.userId, dto);
  }

  @Post('webhook')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Stripe payment gateway webhook receiver' })
  async stripeWebhook(
    @Req() req: any,
    @Headers('stripe-signature') signature?: string,
  ) {
    const rawBody = req.body;
    return this.coinsService.handleStripeWebhook(rawBody, signature);
  }

  // ===========================================================================
  // 4. BADGES & ACHIEVEMENTS
  // ===========================================================================

  @Get('badges')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all unlocked gamification badges and achievement milestones' })
  async getBadges(@CurrentUser() user: CurrentUserPayload) {
    return this.coinsService.getUserBadges(user.userId);
  }

  // ===========================================================================
  // 5. ADMIN ADJUSTMENT
  // ===========================================================================

  @Post('admin/adjust')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Admin manual credit or debit adjustment with audit trail' })
  async adminAdjust(@Body() dto: AdminAdjustCoinsDto) {
    return this.coinsService.adminAdjustCoins(dto);
  }
}
