import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CefrLevel } from '@prisma/client';
import { GetModulesQueryDto, GetVocabularyQueryDto } from './dto/learning-query.dto.js';
import { QuizSubmissionDto } from './dto/quiz-submission.dto.js';
import { ToggleBookmarkDto } from './dto/toggle-bookmark.dto.js';

@Injectable()
export class LearningService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all CEFR learning levels with optional completion percentages for the authenticated user.
   */
  async getLevels(userId?: string) {
    const levels = await this.prisma.learningLevel.findMany({
      orderBy: { sequenceOrder: 'asc' },
      include: {
        modules: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
        },
      },
    });

    let completedLessonIds = new Set<string>();
    if (userId) {
      const progressList = await this.prisma.lessonProgress.findMany({
        where: { userId, isCompleted: true },
        select: { lessonId: true },
      });
      completedLessonIds = new Set(progressList.map((p) => p.lessonId));
    }

    return levels.map((lvl) => {
      const lessonIds = lvl.modules.flatMap((m) => m.lessons.map((l) => l.id));
      const totalLessons = lessonIds.length;
      const completedLessons = lessonIds.filter((id) => completedLessonIds.has(id)).length;
      const progressPercentage =
        totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        id: lvl.id,
        code: lvl.code,
        title: lvl.title,
        description: lvl.description,
        sequenceOrder: lvl.sequenceOrder,
        totalModules: lvl.modules.length,
        totalLessons,
        completedLessons,
        progressPercentage,
      };
    });
  }

  /**
   * Lists curriculum modules, optionally filtered by CEFR level code.
   * Localizes lesson titles and summaries based on the requested locale.
   */
  async getModules(query: GetModulesQueryDto, userId?: string) {
    const locale = query.locale || 'en';
    const whereClause: any = {};

    if (query.levelCode) {
      whereClause.level = { code: query.levelCode as CefrLevel };
    }

    const modules = await this.prisma.learningModule.findMany({
      where: whereClause,
      orderBy: { sequenceOrder: 'asc' },
      include: {
        level: {
          select: { id: true, code: true, title: true },
        },
        lessons: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            translations: true,
          },
        },
      },
    });

    let completedLessonMap = new Map<string, { isCompleted: boolean; score: number | null }>();
    if (userId) {
      const progress = await this.prisma.lessonProgress.findMany({
        where: { userId },
        select: { lessonId: true, isCompleted: true, scorePercentage: true },
      });
      completedLessonMap = new Map(
        progress.map((p) => [p.lessonId, { isCompleted: p.isCompleted, score: p.scorePercentage }]),
      );
    }

    return modules.map((mod) => ({
      id: mod.id,
      title: mod.title,
      description: mod.description,
      sequenceOrder: mod.sequenceOrder,
      level: mod.level,
      lessons: mod.lessons.map((l) => {
        const translation =
          l.translations.find((t) => t.languageCode === locale) ||
          l.translations.find((t) => t.languageCode === 'en') ||
          null;

        const userStatus = completedLessonMap.get(l.id);

        return {
          id: l.id,
          slug: l.slug,
          titleDe: l.titleDe,
          titleLocalized: translation?.title || l.titleDe,
          summary: translation?.summary || null,
          estimatedMinutes: l.estimatedMinutes,
          coinReward: l.coinReward,
          sequenceOrder: l.sequenceOrder,
          isCompleted: userStatus?.isCompleted || false,
          userScore: userStatus?.score ?? null,
        };
      }),
    }));
  }

  /**
   * Retrieves full lesson detail by unique slug with vocabulary, exercises, and quiz questions.
   * Strips correct answer flags from quiz options so clients cannot inspect answers in transit.
   */
  async getLessonBySlug(slug: string, locale = 'en', userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { slug },
      include: {
        module: {
          include: {
            level: true,
          },
        },
        translations: true,
        vocabulary: true,
        exercises: {
          orderBy: { sequenceOrder: 'asc' },
        },
        quizQuestions: {
          orderBy: { sequenceOrder: 'asc' },
          include: {
            options: {
              orderBy: { sequenceOrder: 'asc' },
              select: {
                id: true,
                questionId: true,
                optionTextDe: true,
                optionTranslation: true,
                sequenceOrder: true,
                // Omit isCorrect to prevent client-side answer sniffing
              },
            },
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with slug "${slug}" was not found.`);
    }

    const localizedTranslation =
      lesson.translations.find((t) => t.languageCode === locale) ||
      lesson.translations.find((t) => t.languageCode === 'en') ||
      null;

    let isLessonBookmarked = false;
    let bookmarkedVocabIds = new Set<string>();
    let userProgress: { isCompleted: boolean; scorePercentage: number | null } | null = null;

    if (userId) {
      const [lessonBookmark, vocabBookmarks, progress] = await Promise.all([
        this.prisma.userBookmark.findFirst({
          where: { userId, lessonId: lesson.id },
        }),
        this.prisma.userBookmark.findMany({
          where: { userId, vocabularyId: { not: null } },
          select: { vocabularyId: true },
        }),
        this.prisma.lessonProgress.findUnique({
          where: { userId_lessonId: { userId, lessonId: lesson.id } },
        }),
      ]);

      isLessonBookmarked = !!lessonBookmark;
      bookmarkedVocabIds = new Set(
        vocabBookmarks.map((b) => b.vocabularyId).filter((id): id is string => id !== null),
      );
      if (progress) {
        userProgress = {
          isCompleted: progress.isCompleted,
          scorePercentage: progress.scorePercentage,
        };
      }
    }

    return {
      id: lesson.id,
      slug: lesson.slug,
      titleDe: lesson.titleDe,
      titleLocalized: localizedTranslation?.title || lesson.titleDe,
      summary: localizedTranslation?.summary || null,
      grammarNotesDe: lesson.grammarNotesDe,
      grammarNotesLocalized: localizedTranslation?.grammarNotes || lesson.grammarNotesDe,
      estimatedMinutes: lesson.estimatedMinutes,
      coinReward: lesson.coinReward,
      module: {
        id: lesson.module.id,
        title: lesson.module.title,
        level: lesson.module.level,
      },
      isBookmarked: isLessonBookmarked,
      userProgress,
      vocabulary: lesson.vocabulary.map((v) => ({
        ...v,
        isBookmarked: bookmarkedVocabIds.has(v.id),
      })),
      exercises: lesson.exercises,
      quizQuestions: lesson.quizQuestions,
    };
  }

  /**
   * Strictly evaluates a quiz submission server-side.
   * Compares each user-chosen option against the database source of truth.
   * Grants coin rewards and records progress if score >= 70%.
   */
  async submitQuiz(userId: string, lessonId: string, dto: QuizSubmissionDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        quizQuestions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with ID "${lessonId}" was not found.`);
    }

    if (!lesson.quizQuestions || lesson.quizQuestions.length === 0) {
      throw new BadRequestException('This lesson does not currently have any quiz questions configured.');
    }

    const totalQuestions = lesson.quizQuestions.length;
    let correctAnswersCount = 0;
    const answerRecords: {
      questionId: string;
      selectedOptionId: string | null;
      isCorrect: boolean;
      feedback: {
        questionDe: string;
        explanationDe: string | null;
        explanationTranslation: any;
        correctOptionId: string | null;
      };
    }[] = [];

    const submissionMap = new Map(dto.answers.map((a) => [a.questionId, a.selectedOptionId]));

    for (const question of lesson.quizQuestions) {
      const selectedOptionId = submissionMap.get(question.id) || null;
      const correctOption = question.options.find((opt) => opt.isCorrect);
      const isCorrect = !!correctOption && selectedOptionId === correctOption.id;

      if (isCorrect) {
        correctAnswersCount += 1;
      }

      answerRecords.push({
        questionId: question.id,
        selectedOptionId,
        isCorrect,
        feedback: {
          questionDe: question.questionDe,
          explanationDe: question.explanationDe,
          explanationTranslation: question.explanationTranslation,
          correctOptionId: correctOption?.id || null,
        },
      });
    }

    const scorePercentage = Math.round((correctAnswersCount / totalQuestions) * 100);
    const passed = scorePercentage >= 70;

    // Database atomic transaction
    const attempt = await this.prisma.$transaction(async (tx) => {
      const createdAttempt = await tx.quizAttempt.create({
        data: {
          userId,
          lessonId,
          totalQuestions,
          correctAnswers: correctAnswersCount,
          scorePercentage,
          passed,
          answers: {
            create: answerRecords.map((r) => ({
              questionId: r.questionId,
              selectedOptionId: r.selectedOptionId,
              isCorrect: r.isCorrect,
            })),
          },
        },
      });

      // Update lesson progress
      const existingProgress = await tx.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
      });

      const highestScore = Math.max(existingProgress?.scorePercentage || 0, scorePercentage);

      await tx.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: {
          isCompleted: existingProgress?.isCompleted || passed,
          scorePercentage: highestScore,
          completedAt: passed && !existingProgress?.isCompleted ? new Date() : existingProgress?.completedAt,
          lastAccessedAt: new Date(),
        },
        create: {
          userId,
          lessonId,
          isCompleted: passed,
          scorePercentage,
          completedAt: passed ? new Date() : null,
          lastAccessedAt: new Date(),
        },
      });

      return createdAttempt;
    });

    return {
      attemptId: attempt.id,
      lessonId,
      totalQuestions,
      correctAnswers: correctAnswersCount,
      scorePercentage,
      passed,
      passingThreshold: 70,
      coinRewardEarned: passed ? lesson.coinReward : 0,
      answers: answerRecords.map((r) => ({
        questionId: r.questionId,
        selectedOptionId: r.selectedOptionId,
        isCorrect: r.isCorrect,
        ...r.feedback,
      })),
    };
  }

  /**
   * Calculates the user's active learning streak in consecutive days.
   */
  async getStreak(userId: string) {
    const [progressEvents, attempts] = await Promise.all([
      this.prisma.lessonProgress.findMany({
        where: { userId, isCompleted: true },
        select: { completedAt: true, lastAccessedAt: true },
      }),
      this.prisma.quizAttempt.findMany({
        where: { userId },
        select: { createdAt: true },
      }),
    ]);

    const activeDates = new Set<string>();

    for (const p of progressEvents) {
      if (p.completedAt) {
        activeDates.add(p.completedAt.toISOString().split('T')[0]);
      }
      activeDates.add(p.lastAccessedAt.toISOString().split('T')[0]);
    }

    for (const a of attempts) {
      activeDates.add(a.createdAt.toISOString().split('T')[0]);
    }

    const sortedDates = Array.from(activeDates).sort().reverse();
    const totalCompletedLessons = progressEvents.filter((p) => p.completedAt !== null).length;

    if (sortedDates.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        totalCompletedLessons: 0,
        lastActiveDate: null,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    let checkDate = new Date();

    // If not active today, check if active yesterday to maintain current streak
    if (!sortedDates.includes(todayStr) && sortedDates.includes(yesterdayStr)) {
      checkDate = new Date(Date.now() - 86400000);
    }

    const dateSet = new Set(sortedDates);
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      if (dateSet.has(dateKey)) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      currentStreak,
      longestStreak: Math.max(currentStreak, sortedDates.length > 0 ? 1 : 0),
      totalCompletedLessons,
      lastActiveDate: sortedDates[0],
    };
  }

  /**
   * Toggles bookmark for either a lesson or a vocabulary item.
   */
  async toggleBookmark(userId: string, dto: ToggleBookmarkDto) {
    if (!dto.lessonId && !dto.vocabularyId) {
      throw new BadRequestException('Either lessonId or vocabularyId must be specified.');
    }

    if (dto.vocabularyId) {
      const existing = await this.prisma.userBookmark.findFirst({
        where: { userId, vocabularyId: dto.vocabularyId },
      });

      if (existing) {
        await this.prisma.userBookmark.delete({ where: { id: existing.id } });
        return { bookmarked: false, message: 'Vocabulary removed from bookmarks.' };
      }

      const created = await this.prisma.userBookmark.create({
        data: {
          userId,
          vocabularyId: dto.vocabularyId,
          notes: dto.notes,
        },
      });
      return { bookmarked: true, bookmarkId: created.id, message: 'Vocabulary bookmarked.' };
    }

    if (dto.lessonId) {
      const existing = await this.prisma.userBookmark.findFirst({
        where: { userId, lessonId: dto.lessonId },
      });

      if (existing) {
        await this.prisma.userBookmark.delete({ where: { id: existing.id } });
        return { bookmarked: false, message: 'Lesson removed from bookmarks.' };
      }

      const created = await this.prisma.userBookmark.create({
        data: {
          userId,
          lessonId: dto.lessonId,
          notes: dto.notes,
        },
      });
      return { bookmarked: true, bookmarkId: created.id, message: 'Lesson bookmarked.' };
    }

    throw new BadRequestException('Invalid bookmark request.');
  }

  /**
   * Retrieves all bookmarks saved by the authenticated user.
   */
  async getBookmarks(userId: string) {
    const bookmarks = await this.prisma.userBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        lesson: {
          select: {
            id: true,
            slug: true,
            titleDe: true,
            estimatedMinutes: true,
            module: {
              select: {
                title: true,
                level: { select: { code: true } },
              },
            },
          },
        },
        vocabulary: true,
      },
    });

    return bookmarks.map((b) => ({
      id: b.id,
      notes: b.notes,
      createdAt: b.createdAt,
      type: b.lessonId ? 'lesson' : 'vocabulary',
      lesson: b.lesson,
      vocabulary: b.vocabulary,
    }));
  }

  /**
   * Search and browse vocabulary items with pagination.
   */
  async getVocabulary(query: GetVocabularyQueryDto, userId?: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.lessonId) {
      where.lessonId = query.lessonId;
    }
    if (query.search) {
      where.OR = [
        { word: { contains: query.search, mode: 'insensitive' } },
        { exampleSentenceDe: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.vocabularyItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { word: 'asc' },
        include: {
          lesson: {
            select: {
              id: true,
              slug: true,
              titleDe: true,
            },
          },
        },
      }),
      this.prisma.vocabularyItem.count({ where }),
    ]);

    let bookmarkedIds = new Set<string>();
    if (userId) {
      const userBookmarks = await this.prisma.userBookmark.findMany({
        where: { userId, vocabularyId: { not: null } },
        select: { vocabularyId: true },
      });
      bookmarkedIds = new Set(
        userBookmarks
          .map((b: { vocabularyId: string | null }) => b.vocabularyId)
          .filter((id): id is string => id !== null),
      );
    }

    return {
      items: items.map((item: (typeof items)[number]) => ({
        ...item,
        isBookmarked: bookmarkedIds.has(item.id),
      })),
      pagination: {
        page,
        limit,
        totalItems: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
