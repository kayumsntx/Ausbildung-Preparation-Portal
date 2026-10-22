import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SpeakingService } from './speaking.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';
import { UpdateSpeakingProfileDto } from './dto/update-speaking-profile.dto.js';
import { CreateSessionRequestDto } from './dto/create-session-request.dto.js';
import { SendSignalingMessageDto } from './dto/signaling.dto.js';
import { SubmitRatingDto } from './dto/submit-rating.dto.js';
import { SubmitReportDto } from './dto/submit-report.dto.js';
import { CefrLevel, SpeakingTopicCategory } from '@prisma/client';

@ApiTags('Speaking Practice Partner & WebRTC Calls')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('speaking')
export class SpeakingController {
  constructor(private readonly speakingService: SpeakingService) {}

  // ===========================================================================
  // 1. PARTNER PROFILE
  // ===========================================================================

  @Get('profile')
  @ApiOperation({ summary: 'Get current user speaking partner profile and speaking stats' })
  @ApiResponse({ status: 200, description: 'Speaking profile returned.' })
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.speakingService.getProfile(user.userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update speaking profile, CEFR level, gender filter and availability' })
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: UpdateSpeakingProfileDto,
  ) {
    return this.speakingService.updateProfile(user.userId, dto);
  }

  // ===========================================================================
  // 2. MATCHMAKING & SESSION
  // ===========================================================================

  @Post('matchmake')
  @ApiOperation({ summary: 'Join matchmaking pool or find compatible peer for German speaking practice' })
  @ApiResponse({ status: 201, description: 'Match found or waiting room created.' })
  async matchmake(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateSessionRequestDto,
  ) {
    return this.speakingService.findOrJoinMatchmaking(user.userId, dto);
  }

  @Get('sessions/:id')
  @ApiOperation({ summary: 'Get details and participant info of a speaking session' })
  @ApiParam({ name: 'id', description: 'Session UUID' })
  async getSessionById(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.speakingService.getSessionById(user.userId, id);
  }

  @Get('rooms/:roomId')
  @ApiOperation({ summary: 'Get speaking session by unique WebRTC roomId' })
  @ApiParam({ name: 'roomId', description: 'Room identifier (e.g. room_spk_...)' })
  async getSessionByRoomId(
    @CurrentUser() user: CurrentUserPayload,
    @Param('roomId') roomId: string,
  ) {
    return this.speakingService.getSessionByRoomId(user.userId, roomId);
  }

  @Post('sessions/:id/start')
  @ApiOperation({ summary: 'Start speaking session call (transitions status to ACTIVE)' })
  async startSessionCall(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.speakingService.startSessionCall(user.userId, id);
  }

  @Post('sessions/:id/complete')
  @ApiOperation({ summary: 'Complete speaking session and award +25 virtual coins to both learners' })
  async completeSession(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.speakingService.completeSession(user.userId, id);
  }

  @Post('sessions/:id/cancel')
  @ApiOperation({ summary: 'Cancel waiting or matched speaking session' })
  async cancelSession(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
  ) {
    return this.speakingService.cancelSession(user.userId, id);
  }

  // ===========================================================================
  // 3. WEBRTC SIGNALING RELAY
  // ===========================================================================

  @Post('rooms/:roomId/signal')
  @ApiOperation({ summary: 'Send WebRTC signaling message (SDP offer, answer, or ICE candidate)' })
  async postSignalingMessage(
    @CurrentUser() user: CurrentUserPayload,
    @Param('roomId') roomId: string,
    @Body() dto: SendSignalingMessageDto,
  ) {
    return this.speakingService.postSignalingMessage(user.userId, roomId, dto);
  }

  @Get('rooms/:roomId/signal')
  @ApiOperation({ summary: 'Poll incoming WebRTC signaling messages from the remote peer' })
  @ApiQuery({ name: 'since', required: false, description: 'Timestamp in ms to only fetch newer signals' })
  async pollSignalingMessages(
    @CurrentUser() user: CurrentUserPayload,
    @Param('roomId') roomId: string,
    @Query('since') since?: string,
  ) {
    const timestamp = since ? parseInt(since, 10) : 0;
    return this.speakingService.pollSignalingMessages(user.userId, roomId, timestamp);
  }

  // ===========================================================================
  // 4. GUIDED VOCATIONAL PROMPTS
  // ===========================================================================

  @Get('prompts')
  @ApiOperation({ summary: 'List situational vocational dialog cards and roleplays' })
  @ApiQuery({ name: 'level', enum: CefrLevel, required: false })
  @ApiQuery({ name: 'category', enum: SpeakingTopicCategory, required: false })
  async listPrompts(
    @Query('level') level?: CefrLevel,
    @Query('category') category?: SpeakingTopicCategory,
  ) {
    return this.speakingService.listPromptTemplates(level, category);
  }

  @Get('prompts/:id')
  @ApiOperation({ summary: 'Get single vocational dialog card by ID' })
  async getPromptById(@Param('id') id: string) {
    return this.speakingService.getPromptById(id);
  }

  // ===========================================================================
  // 5. RATINGS & MODERATION SAFETY
  // ===========================================================================

  @Post('sessions/:id/rate')
  @ApiOperation({ summary: 'Submit feedback and star rating for peer speaking partner' })
  async submitRating(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: SubmitRatingDto,
  ) {
    return this.speakingService.submitRating(user.userId, id, dto);
  }

  @Post('sessions/:id/report')
  @ApiOperation({ summary: 'Submit safety or inappropriate behavior report for moderation review' })
  async submitReport(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: SubmitReportDto,
  ) {
    return this.speakingService.submitReport(user.userId, id, dto);
  }
}
