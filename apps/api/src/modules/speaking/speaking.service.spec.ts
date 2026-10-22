import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { SpeakingService } from './speaking.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import {
  CefrLevel,
  SpeakingReportReason,
  SpeakingSessionStatus,
  SpeakingTopicCategory,
} from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('SpeakingService (Phase 7 - Speaking Partners & WebRTC Practice)', () => {
  let speakingService: SpeakingService;
  let prisma: PrismaService;

  let userAId: string;
  let userBId: string;
  let activeSessionId: string;
  let activeRoomId: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [SpeakingService],
    }).compile();

    speakingService = module.get<SpeakingService>(SpeakingService);
    prisma = module.get<PrismaService>(PrismaService);

    // Create 2 test candidates for peer conversation
    const userA = await prisma.user.create({
      data: {
        email: `speaking-user-a-${Date.now()}@example.com`,
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Farhana',
            lastName: 'Hossain',
            targetAusbildungField: 'Pflegefachfrau',
          },
        },
      },
    });
    userAId = userA.id;

    const userB = await prisma.user.create({
      data: {
        email: `speaking-user-b-${Date.now()}@example.com`,
        passwordHash: '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890',
        emailVerified: true,
        profile: {
          create: {
            firstName: 'Sadia',
            lastName: 'Islam',
            targetAusbildungField: 'Pflegefachfrau',
          },
        },
      },
    });
    userBId = userB.id;
  });

  afterAll(async () => {
    if (userAId) {
      await prisma.user.delete({ where: { id: userAId } }).catch(() => {});
    }
    if (userBId) {
      await prisma.user.delete({ where: { id: userBId } }).catch(() => {});
    }
  });

  // ===========================================================================
  // 1. SPEAKING PARTNER PROFILE
  // ===========================================================================
  describe('Speaking Partner Profile', () => {
    it('1. should auto-create and retrieve speaking profile with defaults', async () => {
      const profile = await speakingService.getProfile(userAId);
      expect(profile).toBeDefined();
      expect(profile.userId).toBe(userAId);
      expect(profile.cefrLevel).toBe(CefrLevel.B1);
      expect(profile.nativeLanguage).toBe('Bengali');
      expect(profile.averageRating).toBe(5.0);
    });

    it('2. should update speaking profile with CEFR level, gender filter and bio', async () => {
      const updated = await speakingService.updateProfile(userAId, {
        cefrLevel: CefrLevel.B2,
        gender: 'FEMALE',
        preferredGender: 'FEMALE_ONLY',
        bio: 'Suche Übungspartnerin für B2 Pflege-Fachbegriffe.',
      });

      expect(updated.cefrLevel).toBe(CefrLevel.B2);
      expect(updated.gender).toBe('FEMALE');
      expect(updated.preferredGender).toBe('FEMALE_ONLY');
      expect(updated.bio).toContain('Pflege-Fachbegriffe');

      // Also set up User B profile
      await speakingService.updateProfile(userBId, {
        cefrLevel: CefrLevel.B2,
        gender: 'FEMALE',
        preferredGender: 'ANY',
      });
    });
  });

  // ===========================================================================
  // 2. MATCHMAKING & SESSION LIFECYCLE
  // ===========================================================================
  describe('Matchmaking Pool & Session Connection', () => {
    it('1. User A should join matchmaking pool and create a WAITING session room', async () => {
      const session = await speakingService.findOrJoinMatchmaking(userAId, {
        targetLevel: CefrLevel.B2,
        topicCategory: SpeakingTopicCategory.VOCATIONAL_INTERVIEW,
        genderPreference: 'FEMALE_ONLY',
        durationMinutes: 15,
      });

      expect(session).toBeDefined();
      expect(session.hostUserId).toBe(userAId);
      expect(session.status).toBe(SpeakingSessionStatus.WAITING);
      expect(session.roomId).toContain('room_spk_');
      expect(session.targetLevel).toBe(CefrLevel.B2);
      expect(session.guidedPrompt).toBeDefined();

      activeSessionId = session.id;
      activeRoomId = session.roomId;
    });

    it('2. User B should find User A in pool and connect as MATCHED peer', async () => {
      const matched = await speakingService.findOrJoinMatchmaking(userBId, {
        targetLevel: CefrLevel.B2,
        topicCategory: SpeakingTopicCategory.VOCATIONAL_INTERVIEW,
        genderPreference: 'ANY',
        durationMinutes: 15,
      });

      expect(matched).toBeDefined();
      expect(matched.id).toBe(activeSessionId);
      expect(matched.hostUserId).toBe(userAId);
      expect(matched.peerUserId).toBe(userBId);
      expect(matched.status).toBe(SpeakingSessionStatus.MATCHED);
      expect(matched.guidedPrompt).toBeDefined();
    });

    it('3. Participants should transition session to ACTIVE call', async () => {
      const active = await speakingService.startSessionCall(userAId, activeSessionId);
      expect(active.status).toBe(SpeakingSessionStatus.ACTIVE);
      expect(active.startedAt).toBeDefined();
    });
  });

  // ===========================================================================
  // 3. WEBRTC SIGNALING RELAY
  // ===========================================================================
  describe('WebRTC Ephemeral Signaling Channel', () => {
    it('1. User A should send SDP offer and User B should poll and receive it', async () => {
      const offerSignal = await speakingService.postSignalingMessage(
        userAId,
        activeRoomId,
        {
          type: 'offer',
          payload: { sdp: 'v=0\r\no=alice 12345 1 IN IP4 127.0.0.1...', type: 'offer' },
        },
      );
      expect(offerSignal.senderId).toBe(userAId);
      expect(offerSignal.type).toBe('offer');

      // User B polls incoming signals
      const signalsForB = await speakingService.pollSignalingMessages(
        userBId,
        activeRoomId,
        0,
      );
      expect(signalsForB.length).toBeGreaterThanOrEqual(1);
      expect(signalsForB.some((s) => s.type === 'offer')).toBe(true);
      expect(signalsForB[0].payload.type).toBe('offer');
    });

    it('2. User B should reply with SDP answer and User A should receive it', async () => {
      await speakingService.postSignalingMessage(userBId, activeRoomId, {
        type: 'answer',
        payload: { sdp: 'v=0\r\no=bob 67890 1 IN IP4 127.0.0.1...', type: 'answer' },
      });

      // User A polls incoming signals
      const signalsForA = await speakingService.pollSignalingMessages(
        userAId,
        activeRoomId,
        0,
      );
      expect(signalsForA.some((s) => s.type === 'answer')).toBe(true);
    });
  });

  // ===========================================================================
  // 4. SESSION COMPLETION & REWARDS
  // ===========================================================================
  describe('Session Completion & Coin Rewards', () => {
    it('1. should complete speaking session and credit +25 virtual coins to both partners', async () => {
      const completed = await speakingService.completeSession(userAId, activeSessionId);
      expect(completed.status).toBe(SpeakingSessionStatus.COMPLETED);
      expect(completed.endedAt).toBeDefined();
      expect(completed.coinsAwarded).toBe(25);

      // Verify profile stats updated
      const profileA = await speakingService.getProfile(userAId);
      const profileB = await speakingService.getProfile(userBId);

      expect(profileA.totalSessions).toBe(1);
      expect(profileA.totalMinutes).toBe(15);
      expect(profileA.coinsEarned).toBe(25);

      expect(profileB.totalSessions).toBe(1);
      expect(profileB.totalMinutes).toBe(15);
      expect(profileB.coinsEarned).toBe(25);
    });
  });

  // ===========================================================================
  // 5. RATINGS & MODERATION SAFETY
  // ===========================================================================
  describe('Partner Ratings & Moderation Reporting', () => {
    it('1. User A should rate User B with 5 stars and award SEHR_FREUNDLICH badge', async () => {
      const rating = await speakingService.submitRating(userAId, activeSessionId, {
        stars: 5,
        fluencyScore: 4,
        punctualityScore: 5,
        badge: 'SEHR_FREUNDLICH',
        comment: 'Sehr angenehme Gesprächspartnerin mit klarer Aussprache!',
      });

      expect(rating).toBeDefined();
      expect(rating.stars).toBe(5);
      expect(rating.targetUserId).toBe(userBId);

      // Verify User B average rating reflects this review
      const profileB = await speakingService.getProfile(userBId);
      expect(profileB.averageRating).toBe(5.0);
      expect(profileB.ratingCount).toBe(1);
    });

    it('2. should reject duplicate rating for the same session from the same user', async () => {
      await expect(
        speakingService.submitRating(userAId, activeSessionId, {
          stars: 4,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('3. User B should file a moderation report and flag the session', async () => {
      const reportRes = await speakingService.submitReport(userBId, activeSessionId, {
        reason: SpeakingReportReason.TECHNICAL_FAILURE,
        details: 'Mikrofon hatte kurze Aussetzer am Ende des Gesprächs.',
      });

      expect(reportRes.success).toBe(true);
      expect(reportRes.reportId).toBeDefined();

      const session = await speakingService.getSessionById(userBId, activeSessionId);
      expect(session.status).toBe(SpeakingSessionStatus.REPORTED);
    });
  });

  // ===========================================================================
  // 6. GUIDED DIALOG CARDS (PROMPT TEMPLATES)
  // ===========================================================================
  describe('Vocational Dialog Cards (Prompt Templates)', () => {
    it('1. should list vocational dialogue cards filtered by CEFR level', async () => {
      const b2Prompts = await speakingService.listPromptTemplates(CefrLevel.B2);
      expect(b2Prompts.length).toBeGreaterThanOrEqual(2);
      expect(b2Prompts.every((p) => p.cefrLevel === CefrLevel.B2)).toBe(true);
      expect(
        b2Prompts.some((p) => p.category === SpeakingTopicCategory.VOCATIONAL_INTERVIEW),
      ).toBe(true);
    });
  });
});
