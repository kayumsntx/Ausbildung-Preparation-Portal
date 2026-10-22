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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service.js';
import { QueryCoursesDto } from './dto/query-courses.dto.js';
import { EnrollCourseDto } from './dto/enroll-course.dto.js';
import { CompleteLessonDto } from './dto/complete-lesson.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Courses & LMS')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'List published LMS courses with filters and authenticated enrollment status' })
  @ApiResponse({ status: 200, description: 'List of courses returned successfully.' })
  async getCourses(
    @Query() query: QueryCoursesDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.coursesService.getCourses(query, user?.userId);
  }

  @Get('my-enrollments')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve all active course enrollments and digital certificates for the student' })
  @ApiResponse({ status: 200, description: 'Student enrollments retrieved.' })
  async getUserEnrollments(@CurrentUser() user: CurrentUserPayload) {
    return this.coursesService.getUserEnrollments(user.userId);
  }

  @Get('verify-certificate/:code')
  @ApiOperation({ summary: 'Publicly verify the authenticity of a student completion certificate by unique serial code' })
  @ApiParam({ name: 'code', example: 'CERT-2026-COMP-AB12', description: 'Unique certificate serial code' })
  @ApiResponse({ status: 200, description: 'Certificate verified as authentic.' })
  @ApiResponse({ status: 404, description: 'Certificate not found or invalid.' })
  async verifyCertificate(@Param('code') code: string) {
    return this.coursesService.verifyCertificate(code);
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve course syllabus, free preview lessons, or full lesson access for enrolled students' })
  @ApiParam({ name: 'slug', example: 'complete-german-a1-ausbildung', description: 'Course unique slug' })
  @ApiResponse({ status: 200, description: 'Course details and syllabus retrieved.' })
  @ApiResponse({ status: 404, description: 'Course not found.' })
  async getCourseBySlug(
    @Param('slug') slug: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.coursesService.getCourseBySlug(slug, user?.userId);
  }

  @Post(':id/enroll')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Enroll in a course using Free, Coins, or Stripe card payment with idempotency' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiResponse({ status: 201, description: 'Course enrollment created.' })
  @ApiResponse({ status: 400, description: 'Invalid payment or already enrolled.' })
  async enrollCourse(
    @Param('id') courseId: string,
    @Body() dto: EnrollCourseDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.coursesService.enrollCourse(user.userId, courseId, dto);
  }

  @Post(':id/lessons/complete')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Mark lesson completed in active course enrollment; automatically generates certificate upon 100%' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'Lesson completed and progress updated.' })
  async completeLesson(
    @Param('id') courseId: string,
    @Body() dto: CompleteLessonDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.coursesService.completeLesson(user.userId, courseId, dto);
  }
}
