import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { JobsService } from './jobs.service.js';
import { SearchJobsQueryDto } from './dto/search-jobs.dto.js';
import { SaveJobDto } from './dto/save-job.dto.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { OptionalJwtAuthGuard } from '../../common/guards/optional-jwt-auth.guard.js';
import { CurrentUser, CurrentUserPayload } from '../../common/decorators/current-user.decorator.js';
import { JobApplicationStatus } from '@prisma/client';

@ApiTags('Job Search & Applications')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('search')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Search and filter Ausbildung vacancies with local caching and Bundesagentur API fallback' })
  @ApiResponse({ status: 200, description: 'List of matching Ausbildung vacancies with pagination.' })
  async searchJobs(
    @Query() query: SearchJobsQueryDto,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.jobsService.searchJobs(query, user?.userId);
  }

  @Get('saved')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all bookmarked Ausbildung vacancies for the authenticated student' })
  @ApiResponse({ status: 200, description: 'Saved jobs list retrieved.' })
  async getSavedJobs(@CurrentUser() user: CurrentUserPayload) {
    return this.jobsService.getSavedJobs(user.userId);
  }

  @Get('applications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve student job application tracker pipeline with stage counts' })
  @ApiQuery({ name: 'status', required: false, enum: JobApplicationStatus, description: 'Filter by specific stage' })
  @ApiResponse({ status: 200, description: 'Application pipeline and metrics retrieved.' })
  async listApplications(
    @CurrentUser() user: CurrentUserPayload,
    @Query('status') status?: JobApplicationStatus,
  ) {
    return this.jobsService.listApplications(user.userId, status);
  }

  @Post('applications')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Add a new application to the tracking pipeline' })
  @ApiResponse({ status: 201, description: 'Application created in tracker.' })
  async createApplication(
    @CurrentUser() user: CurrentUserPayload,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.jobsService.createApplication(user.userId, dto);
  }

  @Patch('applications/:id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update application stage (e.g. APPLIED -> INTERVIEW -> OFFER) with notes' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application stage updated.' })
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.jobsService.updateApplicationStatus(user.userId, id, dto);
  }

  @Delete('applications/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Remove a tracked application from the pipeline' })
  @ApiParam({ name: 'id', description: 'Application UUID' })
  @ApiResponse({ status: 200, description: 'Application removed.' })
  async deleteApplication(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.jobsService.deleteApplication(user.userId, id);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Retrieve full job posting details with bookmark and application status' })
  @ApiParam({ name: 'id', description: 'Job listing UUID' })
  @ApiResponse({ status: 200, description: 'Job detail retrieved.' })
  @ApiResponse({ status: 404, description: 'Job not found.' })
  async getJobById(
    @Param('id') id: string,
    @CurrentUser() user?: CurrentUserPayload,
  ) {
    return this.jobsService.getJobById(id, user?.userId);
  }

  @Post(':id/save')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Bookmark or un-bookmark an Ausbildung vacancy' })
  @ApiParam({ name: 'id', description: 'Job listing UUID' })
  @ApiResponse({ status: 200, description: 'Bookmark toggled.' })
  async toggleSaveJob(
    @Param('id') id: string,
    @Body() dto: SaveJobDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.jobsService.toggleSaveJob(user.userId, id, dto);
  }
}
