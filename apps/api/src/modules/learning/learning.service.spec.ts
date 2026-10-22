import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { LearningService } from './learning.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotFoundException } from '@nestjs/common';

describe('LearningService Integration & Security Tests', () => {
  let prisma: PrismaService;
  let learningService: LearningService;
  let testUserId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    learningService = new LearningService(prisma);

    // Create a temporary test user for progress and quiz testing
    const testUser = await prisma.user.create({
      data: {
        email: `learning.test.${Date.now()}@example.com`,
        passwordHash: 'test_hash_for_learning_service',
        status: 'ACTIVE',
        emailVerified: true,
      },
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await prisma.user.deleteMany({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  it('1. should retrieve all CEFR levels ordered by sequence with correct progress calculation', async () => {
    const levels = await learningService.getLevels(testUserId);
    expect(levels).toBeDefined();
    expect(levels.length).toBeGreaterThanOrEqual(4);

    const codes = levels.map((l) => l.code);
    expect(codes).toContain('A1');
    expect(codes).toContain('A2');
    expect(codes).toContain('B1');
    expect(codes).toContain('B2');

    const a1Level = levels.find((l) => l.code === 'A1');
    expect(a1Level).toBeDefined();
    expect(a1Level!.totalLessons).toBeGreaterThanOrEqual(1);
    expect(a1Level!.progressPercentage).toBe(0); // Initially 0% completed
  });

  it('2. should list curriculum modules filtered by CEFR level and localized into Bengali', async () => {
    const modules = await learningService.getModules(
      { levelCode: 'A1' as any, locale: 'bn' },
      testUserId,
    );
    expect(modules).toBeDefined();
    expect(modules.length).toBeGreaterThanOrEqual(1);

    const firstModule = modules[0];
    expect(firstModule.level.code).toBe('A1');
    expect(firstModule.lessons.length).toBeGreaterThanOrEqual(1);

    const firstLesson = firstModule.lessons[0];
    // Localized title in Bengali from seed
    expect(firstLesson.titleLocalized).toContain('পরিচয়');
    expect(firstLesson.isCompleted).toBe(false);
  });

  it('3. should retrieve full lesson detail and STRIP isCorrect from quiz options (prevent cheating)', async () => {
    const lesson = await learningService.getLessonBySlug('a1-m1-sich-vorstellen', 'en', testUserId);

    expect(lesson).toBeDefined();
    expect(lesson.slug).toBe('a1-m1-sich-vorstellen');
    expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(1);
    expect(lesson.quizQuestions.length).toBeGreaterThanOrEqual(1);

    // Verify security: isCorrect must NOT be present in options returned to client
    const firstQuestion = lesson.quizQuestions[0];
    for (const option of firstQuestion.options) {
      expect((option as any).isCorrect).toBeUndefined();
    }
  });

  it('4. should throw NotFoundException for non-existent lesson slug', async () => {
    await expect(
      learningService.getLessonBySlug('non-existent-lesson-slug-xyz'),
    ).rejects.toThrow(NotFoundException);
  });

  it('5. should strictly evaluate quiz server-side: reject failing score (< 70%)', async () => {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: 'a1-m1-sich-vorstellen' },
      include: {
        quizQuestions: {
          include: { options: true },
        },
      },
    });
    expect(lesson).toBeDefined();

    // Submit intentionally wrong answers
    const wrongAnswers = lesson!.quizQuestions.map((q) => {
      const wrongOption = q.options.find((o) => !o.isCorrect) || q.options[0];
      return {
        questionId: q.id,
        selectedOptionId: wrongOption.id,
      };
    });

    const result = await learningService.submitQuiz(testUserId, lesson!.id, {
      answers: wrongAnswers,
    });

    expect(result.passed).toBe(false);
    expect(result.scorePercentage).toBe(0);
    expect(result.coinRewardEarned).toBe(0);

    // Verify progress record is not marked completed
    const progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: testUserId, lessonId: lesson!.id } },
    });
    expect(progress?.isCompleted).toBe(false);
  });

  it('6. should evaluate quiz server-side: pass and reward user on 100% correct score', async () => {
    const lesson = await prisma.lesson.findUnique({
      where: { slug: 'a1-m1-sich-vorstellen' },
      include: {
        quizQuestions: {
          include: { options: true },
        },
      },
    });

    // Submit all correct options
    const correctAnswers = lesson!.quizQuestions.map((q) => {
      const rightOption = q.options.find((o) => o.isCorrect)!;
      return {
        questionId: q.id,
        selectedOptionId: rightOption.id,
      };
    });

    const result = await learningService.submitQuiz(testUserId, lesson!.id, {
      answers: correctAnswers,
    });

    expect(result.passed).toBe(true);
    expect(result.scorePercentage).toBe(100);
    expect(result.coinRewardEarned).toBe(lesson!.coinReward);

    // Verify lesson_progress updated to isCompleted = true
    const progress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId: testUserId, lessonId: lesson!.id } },
    });
    expect(progress?.isCompleted).toBe(true);
    expect(progress?.scorePercentage).toBe(100);
    expect(progress?.completedAt).toBeDefined();
  });

  it('7. should toggle vocabulary bookmark on and off', async () => {
    const vocab = await prisma.vocabularyItem.findFirst();
    expect(vocab).toBeDefined();

    // 1st toggle: bookmark
    const res1 = await learningService.toggleBookmark(testUserId, { vocabularyId: vocab!.id });
    expect(res1.bookmarked).toBe(true);

    const bookmarks = await learningService.getBookmarks(testUserId);
    expect(bookmarks.some((b) => b.vocabulary?.id === vocab!.id)).toBe(true);

    // 2nd toggle: unbookmark
    const res2 = await learningService.toggleBookmark(testUserId, { vocabularyId: vocab!.id });
    expect(res2.bookmarked).toBe(false);
  });

  it('8. should calculate consecutive learning streak correctly', async () => {
    const streak = await learningService.getStreak(testUserId);
    expect(streak).toBeDefined();
    expect(streak.currentStreak).toBeGreaterThanOrEqual(1);
    expect(streak.totalCompletedLessons).toBeGreaterThanOrEqual(1);
  });
});
