import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CefrLevel,
  SpeakingSessionStatus,
  SpeakingTopicCategory,
} from '@prisma/client';
import { UpdateSpeakingProfileDto } from './dto/update-speaking-profile.dto.js';
import { CreateSessionRequestDto } from './dto/create-session-request.dto.js';
import { SendSignalingMessageDto, SignalingEnvelope } from './dto/signaling.dto.js';
import { SubmitRatingDto } from './dto/submit-rating.dto.js';
import { SubmitReportDto } from './dto/submit-report.dto.js';

interface EphemeralSignal {
  senderId: string;
  type: string;
  payload: Record<string, any>;
  timestamp: number;
}

@Injectable()
export class SpeakingService {
  // In-memory signaling cache for low-latency WebRTC exchange: Map<roomId, EphemeralSignal[]>
  private readonly signalingChannels = new Map<string, EphemeralSignal[]>();

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // 1. SPEAKING PARTNER PROFILE
  // ===========================================================================

  async getProfile(userId: string) {
    let profile = await this.prisma.speakingPartnerProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                avatarUrl: true,
                targetAusbildungField: true,
              },
            },
          },
        },
      },
    });

    if (!profile) {
      profile = await this.prisma.speakingPartnerProfile.create({
        data: {
          userId,
          cefrLevel: CefrLevel.B1,
          nativeLanguage: 'Bengali',
          preferredGender: 'ANY',
          isAvailable: true,
        },
        include: {
          user: {
            select: {
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatarUrl: true,
                  targetAusbildungField: true,
                },
              },
            },
          },
        },
      });
    }

    return profile;
  }

  async updateProfile(userId: string, dto: UpdateSpeakingProfileDto) {
    // Ensure profile exists
    await this.getProfile(userId);

    return this.prisma.speakingPartnerProfile.update({
      where: { userId },
      data: {
        ...(dto.cefrLevel && { cefrLevel: dto.cefrLevel }),
        ...(dto.gender !== undefined && { gender: dto.gender }),
        ...(dto.preferredGender !== undefined && { preferredGender: dto.preferredGender }),
        ...(dto.nativeLanguage !== undefined && { nativeLanguage: dto.nativeLanguage }),
        ...(dto.targetVocationalField !== undefined && {
          targetVocationalField: dto.targetVocationalField,
        }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
      },
    });
  }

  // ===========================================================================
  // 2. MATCHMAKING & SESSION LIFECYCLE
  // ===========================================================================

  async findOrJoinMatchmaking(userId: string, dto: CreateSessionRequestDto) {
    const callerProfile = await this.getProfile(userId);

    // Check if user already has an ongoing WAITING session
    const existingWaiting = await this.prisma.speakingSession.findFirst({
      where: {
        hostUserId: userId,
        status: SpeakingSessionStatus.WAITING,
      },
    });

    if (existingWaiting) {
      return existingWaiting;
    }

    // Look for compatible peer session waiting in pool
    const waitingSessions = await this.prisma.speakingSession.findMany({
      where: {
        status: SpeakingSessionStatus.WAITING,
        hostUserId: { not: userId },
        targetLevel: dto.targetLevel,
      },
      include: {
        hostUser: {
          include: {
            speakingProfile: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    let matchedSession = null;
    for (const candidate of waitingSessions) {
      const hostProfile = candidate.hostUser.speakingProfile;
      const callerGender = callerProfile.gender;
      const hostGender = hostProfile?.gender;

      // Check caller's gender requirements
      if (dto.genderPreference === 'FEMALE_ONLY' && hostGender !== 'FEMALE') {
        continue;
      }
      if (dto.genderPreference === 'SAME_GENDER' && callerGender && hostGender !== callerGender) {
        continue;
      }

      // Check host's gender requirements
      if (candidate.genderPreference === 'FEMALE_ONLY' && callerGender !== 'FEMALE') {
        continue;
      }
      if (candidate.genderPreference === 'SAME_GENDER' && hostGender && callerGender !== hostGender) {
        continue;
      }

      matchedSession = candidate;
      break;
    }

    // If match found, connect peer to session
    if (matchedSession) {
      // Pick matching or relevant prompt
      const prompt = await this.selectPrompt(
        dto.targetLevel,
        dto.topicCategory || matchedSession.topicCategory,
      );

      const updated = await this.prisma.speakingSession.update({
        where: { id: matchedSession.id },
        data: {
          peerUserId: userId,
          status: SpeakingSessionStatus.MATCHED,
          guidedPromptId: prompt?.id ?? null,
          guidedPrompt: (prompt as any) ?? null,
        },
        include: {
          hostUser: {
            select: {
              id: true,
              profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
              speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
            },
          },
          peerUser: {
            select: {
              id: true,
              profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
              speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
            },
          },
        },
      });

      return updated;
    }

    // No match found -> create waiting room
    const prompt = await this.selectPrompt(
      dto.targetLevel,
      dto.topicCategory || SpeakingTopicCategory.GENERAL_CONVERSATION,
    );

    const roomId = `room_spk_${randomUUID().replace(/-/g, '').slice(0, 16)}`;

    return this.prisma.speakingSession.create({
      data: {
        roomId,
        hostUserId: userId,
        status: SpeakingSessionStatus.WAITING,
        targetLevel: dto.targetLevel,
        topicCategory: dto.topicCategory || SpeakingTopicCategory.GENERAL_CONVERSATION,
        genderPreference: dto.genderPreference || 'ANY',
        durationMinutes: dto.durationMinutes || 15,
        guidedPromptId: prompt?.id ?? null,
        guidedPrompt: (prompt as any) ?? null,
      },
      include: {
        hostUser: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
          },
        },
      },
    });
  }

  async getSessionById(userId: string, sessionId: string) {
    const session = await this.prisma.speakingSession.findUnique({
      where: { id: sessionId },
      include: {
        hostUser: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
          },
        },
        peerUser: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
          },
        },
        ratings: true,
      },
    });

    if (!session) {
      throw new NotFoundException(`Speaking session '${sessionId}' was not found.`);
    }

    if (session.hostUserId !== userId && session.peerUserId !== userId) {
      throw new ForbiddenException('You are not a participant in this speaking session.');
    }

    return session;
  }

  async getSessionByRoomId(userId: string, roomId: string) {
    const session = await this.prisma.speakingSession.findUnique({
      where: { roomId },
      include: {
        hostUser: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
          },
        },
        peerUser: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true, avatarUrl: true } },
            speakingProfile: { select: { cefrLevel: true, averageRating: true, ratingCount: true } },
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundException(`Room '${roomId}' not found.`);
    }

    if (session.hostUserId !== userId && session.peerUserId !== userId) {
      throw new ForbiddenException('You are not authorized for this room.');
    }

    return session;
  }

  async startSessionCall(userId: string, sessionId: string) {
    const session = await this.getSessionById(userId, sessionId);

    if (session.status === SpeakingSessionStatus.ACTIVE) {
      return session;
    }

    return this.prisma.speakingSession.update({
      where: { id: sessionId },
      data: {
        status: SpeakingSessionStatus.ACTIVE,
        startedAt: session.startedAt || new Date(),
      },
    });
  }

  async completeSession(userId: string, sessionId: string) {
    const session = await this.getSessionById(userId, sessionId);

    if (session.status === SpeakingSessionStatus.COMPLETED) {
      return session;
    }

    const awardAmount = 25; // 25 virtual coins for completing a vocational speaking drill

    const completed = await this.prisma.speakingSession.update({
      where: { id: sessionId },
      data: {
        status: SpeakingSessionStatus.COMPLETED,
        endedAt: new Date(),
        coinsAwarded: awardAmount,
      },
    });

    // Update stats and award coins for both participants
    const participants = [session.hostUserId, session.peerUserId].filter(Boolean) as string[];
    for (const pId of participants) {
      await this.prisma.speakingPartnerProfile.updateMany({
        where: { userId: pId },
        data: {
          totalSessions: { increment: 1 },
          totalMinutes: { increment: session.durationMinutes },
          coinsEarned: { increment: awardAmount },
        },
      });
    }

    return completed;
  }

  async cancelSession(userId: string, sessionId: string) {
    const session = await this.getSessionById(userId, sessionId);

    if (
      session.status !== SpeakingSessionStatus.WAITING &&
      session.status !== SpeakingSessionStatus.MATCHED
    ) {
      throw new BadRequestException('Cannot cancel a session that is already in progress or completed.');
    }

    // Clean up in-memory signaling channel
    this.signalingChannels.delete(session.roomId);

    return this.prisma.speakingSession.update({
      where: { id: sessionId },
      data: { status: SpeakingSessionStatus.CANCELLED },
    });
  }

  // ===========================================================================
  // 3. GUIDED VOCATIONAL DIALOG CARDS
  // ===========================================================================

  async listPromptTemplates(level?: CefrLevel, category?: SpeakingTopicCategory) {
    return this.prisma.speakingPromptTemplate.findMany({
      where: {
        isActive: true,
        ...(level && { cefrLevel: level }),
        ...(category && { category }),
      },
      orderBy: { cefrLevel: 'asc' },
    });
  }

  async getPromptById(promptId: string) {
    const prompt = await this.prisma.speakingPromptTemplate.findUnique({
      where: { id: promptId },
    });
    if (!prompt) {
      throw new NotFoundException(`Prompt '${promptId}' not found.`);
    }
    return prompt;
  }

  private async selectPrompt(level: CefrLevel, category: SpeakingTopicCategory) {
    const match = await this.prisma.speakingPromptTemplate.findFirst({
      where: {
        isActive: true,
        cefrLevel: level,
        category,
      },
    });

    if (match) return match;

    // Fallback to any prompt matching category or level
    return this.prisma.speakingPromptTemplate.findFirst({
      where: { isActive: true },
    });
  }

  // ===========================================================================
  // 4. RATINGS & MODERATION SAFETY
  // ===========================================================================

  async submitRating(userId: string, sessionId: string, dto: SubmitRatingDto) {
    const session = await this.getSessionById(userId, sessionId);

    if (session.status !== SpeakingSessionStatus.COMPLETED) {
      throw new BadRequestException('Ratings can only be submitted for completed speaking calls.');
    }

    const targetUserId =
      session.hostUserId === userId ? session.peerUserId : session.hostUserId;

    if (!targetUserId) {
      throw new BadRequestException('No peer partner exists on this session to rate.');
    }

    // Check duplicate rating
    const existing = await this.prisma.speakingRating.findFirst({
      where: { sessionId, reviewerId: userId },
    });
    if (existing) {
      throw new BadRequestException('You have already submitted feedback for this session.');
    }

    const rating = await this.prisma.speakingRating.create({
      data: {
        sessionId,
        reviewerId: userId,
        targetUserId,
        stars: dto.stars,
        fluencyScore: dto.fluencyScore,
        punctualityScore: dto.punctualityScore,
        badge: dto.badge,
        comment: dto.comment,
      },
    });

    // Recalculate target user's average rating
    const allRatings = await this.prisma.speakingRating.findMany({
      where: { targetUserId },
      select: { stars: true },
    });

    const ratingCount = allRatings.length;
    const avg =
      ratingCount > 0
        ? allRatings.reduce((sum, r) => sum + r.stars, 0) / ratingCount
        : 5.0;

    await this.prisma.speakingPartnerProfile.updateMany({
      where: { userId: targetUserId },
      data: {
        averageRating: Math.round(avg * 10) / 10,
        ratingCount,
      },
    });

    return rating;
  }

  async submitReport(userId: string, sessionId: string, dto: SubmitReportDto) {
    const session = await this.getSessionById(userId, sessionId);

    const reportedUserId =
      session.hostUserId === userId ? session.peerUserId : session.hostUserId;

    if (!reportedUserId) {
      throw new BadRequestException('No peer partner found on session to report.');
    }

    const report = await this.prisma.speakingReport.create({
      data: {
        sessionId,
        reporterId: userId,
        reportedUserId,
        reason: dto.reason,
        details: dto.details,
      },
    });

    await this.prisma.speakingSession.update({
      where: { id: sessionId },
      data: { status: SpeakingSessionStatus.REPORTED },
    });

    return {
      success: true,
      reportId: report.id,
      message: 'Moderation report submitted. Our team will review the session immediately.',
    };
  }

  // ===========================================================================
  // 5. WEBRTC SIGNALING RELAY (OFFER, ANSWER, ICE CANDIDATES)
  // ===========================================================================

  async postSignalingMessage(
    userId: string,
    roomId: string,
    dto: SendSignalingMessageDto,
  ): Promise<SignalingEnvelope> {
    await this.getSessionByRoomId(userId, roomId);

    const message: EphemeralSignal = {
      senderId: userId,
      type: dto.type,
      payload: dto.payload,
      timestamp: Date.now(),
    };

    if (!this.signalingChannels.has(roomId)) {
      this.signalingChannels.set(roomId, []);
    }

    const queue = this.signalingChannels.get(roomId)!;
    queue.push(message);

    // Keep queue bounded to last 50 signals
    if (queue.length > 50) {
      queue.splice(0, queue.length - 50);
    }

    return message;
  }

  async pollSignalingMessages(
    userId: string,
    roomId: string,
    sinceTimestamp = 0,
  ): Promise<SignalingEnvelope[]> {
    await this.getSessionByRoomId(userId, roomId);

    const queue = this.signalingChannels.get(roomId) || [];
    // Only return signals sent by the OTHER peer after the requested timestamp
    return queue.filter(
      (msg) => msg.senderId !== userId && msg.timestamp > sinceTimestamp,
    );
  }
}
