import {
  Body,
  Controller,
  Get,
  Param,
  Post,
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
import { LearningService } from './learning.service.js';
import { GetModulesQueryDto, GetVocabularyQueryDto } from './dto/learning-query.dto.js';
import { QuizSubmissionDto } from './dto/quiz-submission.dto.js';
import { ToggleBookmarkDto } from './dto/toggle-bookmark.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';

@ApiTags('German Learning')
@Controller('learning')
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get('levels')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List CEFR levels (A1-B2) with optional authenticated user completion percentage' })
  @ApiResponse({ status: 200, description: 'Levels retrieved successfully.' })
  async getLevels(@CurrentUser() user?: CurrentUserPayload) {
    return this.learningService.getLevels(user?.userId);
  }

  @Get('modules')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List curriculum modules filtered by CEFR level and localized into Bengali/English/German' })
  @ApiResponse({ status: 200, description: 'Modules retrieved successfully.' })
  async getModules(
    @Query() query: GetModulesQueryDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.learningService.getModules(query, user?.userId);
  }

  @Get('lessons/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve comprehensive lesson content by slug, including vocabulary and safe quiz questions' })
  @ApiParam({ name: 'slug', example: 'a1-m1-sich-vorstellen', description: 'Unique lesson URL slug' })
  @ApiQuery({ name: 'locale', required: false, example: 'bn', description: 'Target translation locale (bn, en, de)' })
  @ApiResponse({ status: 200, description: 'Lesson detail retrieved.' })
  @ApiResponse({ status: 404, description: 'Lesson not found.' })
  async getLessonBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.learningService.getLessonBySlug(slug, locale || 'en', user?.userId);
  }

  @Post('lessons/:id/quiz-attempt')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Submit quiz answers for server-side evaluation, coin reward attribution, and progress recording' })
  @ApiParam({ name: 'id', description: 'UUID of the lesson being tested' })
  @ApiResponse({ status: 201, description: 'Quiz evaluated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid submission or no quiz questions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async submitQuiz(
    @Param('id') lessonId: string,
    @Body() dto: QuizSubmissionDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.learningService.submitQuiz(user.userId, lessonId, dto);
  }

  @Get('streak')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Calculate current and longest learning streak in consecutive days' })
  @ApiResponse({ status: 200, description: 'Learning streak metrics retrieved.' })
  async getStreak(@CurrentUser() user: CurrentUserPayload) {
    return this.learningService.getStreak(user.userId);
  }

  @Post('bookmarks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Toggle bookmark for a vocabulary item or lesson' })
  @ApiResponse({ status: 200, description: 'Bookmark toggled.' })
  async toggleBookmark(
    @Body() dto: ToggleBookmarkDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.learningService.toggleBookmark(user.userId, dto);
  }

  @Get('bookmarks')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all bookmarked lessons and vocabulary items for the user' })
  @ApiResponse({ status: 200, description: 'Bookmarks retrieved successfully.' })
  async getBookmarks(@CurrentUser() user: CurrentUserPayload) {
    return this.learningService.getBookmarks(user.userId);
  }

  @Get('vocabulary')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Search and browse vocabulary items with phonetic IPA and translations' })
  @ApiResponse({ status: 200, description: 'Vocabulary items retrieved.' })
  async getVocabulary(
    @Query() query: GetVocabularyQueryDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.learningService.getVocabulary(query, user?.userId);
  }
}
