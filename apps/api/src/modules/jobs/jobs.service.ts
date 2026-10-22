import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { BundesagenturJobsucheService } from './bundesagentur.service.js';
import { SearchJobsQueryDto } from './dto/search-jobs.dto.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto.js';
import { SaveJobDto } from './dto/save-job.dto.js';
import { JobApplicationStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly bundesagenturService: BundesagenturJobsucheService,
  ) {}

  /**
   * Search and filter Ausbildung job listings with local PostgreSQL caching
   * and automatic live fallback to Bundesagentur API.
   */
  async searchJobs(query: SearchJobsQueryDto, userId?: string) {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.q) {
      where.OR = [
        { title: { contains: query.q, mode: 'insensitive' } },
        { description: { contains: query.q, mode: 'insensitive' } },
        { employer: { contains: query.q, mode: 'insensitive' } },
        { category: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    if (query.city) {
      where.city = { contains: query.city, mode: 'insensitive' };
    }

    if (query.category) {
      where.category = { contains: query.category, mode: 'insensitive' };
    }

    if (query.requiredGermanLevel) {
      where.requiredGermanLevel = query.requiredGermanLevel;
    }

    if (query.minStipendCents !== undefined) {
      where.stipendYear1Cents = { gte: query.minStipendCents };
    }

    let initialCount = await this.prisma.jobListing.count({ where });

    // If query returned 0 local results and a search term or city was given, trigger live sync from Bundesagentur
    if (initialCount === 0 && (query.q || query.city)) {
      await this.bundesagenturService.syncLiveJobs(query.q || 'Ausbildung', query.city || '', 15);
      initialCount = await this.prisma.jobListing.count({ where });
    }

    const [items, totalItems] = await Promise.all([
      this.prisma.jobListing.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
      }),
      this.prisma.jobListing.count({ where }),
    ]);

    let savedJobIds = new Set<string>();
    let applicationMap = new Map<string, JobApplicationStatus>();

    if (userId) {
      const [saved, applications] = await Promise.all([
        this.prisma.savedJob.findMany({
          where: { userId },
          select: { jobListingId: true },
        }),
        this.prisma.jobApplication.findMany({
          where: { userId, jobListingId: { not: null } },
          select: { jobListingId: true, status: true },
        }),
      ]);

      savedJobIds = new Set(saved.map((s) => s.jobListingId));
      applicationMap = new Map(
        applications.map((a) => [a.jobListingId as string, a.status]),
      );
    }

    return {
      items: items.map((job) => ({
        ...job,
        isSaved: savedJobIds.has(job.id),
        applicationStatus: applicationMap.get(job.id) || null,
      })),
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    };
  }

  /**
   * Retrieves single job details with application and bookmark status.
   */
  async getJobById(id: string, userId?: string) {
    const job = await this.prisma.jobListing.findUnique({
      where: { id },
    });

    if (!job) {
      throw new NotFoundException(`Ausbildung job vacancy with ID "${id}" was not found.`);
    }

    let isSaved = false;
    let applicationStatus: JobApplicationStatus | null = null;

    if (userId) {
      const [saved, application] = await Promise.all([
        this.prisma.savedJob.findUnique({
          where: { userId_jobListingId: { userId, jobListingId: id } },
        }),
        this.prisma.jobApplication.findFirst({
          where: { userId, jobListingId: id },
        }),
      ]);

      isSaved = !!saved;
      applicationStatus = application?.status || null;
    }

    return {
      ...job,
      isSaved,
      applicationStatus,
    };
  }

  /**
   * Toggles bookmark for a job offer.
   */
  async toggleSaveJob(userId: string, jobListingId: string, dto?: SaveJobDto) {
    const job = await this.prisma.jobListing.findUnique({ where: { id: jobListingId } });
    if (!job) {
      throw new NotFoundException(`Job listing with ID "${jobListingId}" not found.`);
    }

    const existing = await this.prisma.savedJob.findUnique({
      where: { userId_jobListingId: { userId, jobListingId } },
    });

    if (existing) {
      await this.prisma.savedJob.delete({ where: { id: existing.id } });
      return { saved: false, message: 'Job removed from saved bookmarks.' };
    }

    const created = await this.prisma.savedJob.create({
      data: {
        userId,
        jobListingId,
        notes: dto?.notes,
      },
    });

    return { saved: true, id: created.id, message: 'Job bookmarked successfully.' };
  }

  /**
   * Lists all saved/bookmarked jobs for the authenticated user.
   */
  async getSavedJobs(userId: string) {
    const saved = await this.prisma.savedJob.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        job: true,
      },
    });

    return saved.map((s) => ({
      savedJobId: s.id,
      notes: s.notes,
      savedAt: s.createdAt,
      job: s.job,
    }));
  }

  /**
   * Creates a tracked job application in the student's pipeline.
   */
  async createApplication(userId: string, dto: CreateApplicationDto) {
    if (!dto.jobListingId && !dto.customCompany) {
      throw new BadRequestException('Either jobListingId or customCompany must be provided to track an application.');
    }

    let company = dto.customCompany;
    let role = dto.customRole;
    let city = dto.city;

    if (dto.jobListingId) {
      const job = await this.prisma.jobListing.findUnique({ where: { id: dto.jobListingId } });
      if (!job) {
        throw new NotFoundException(`Job listing "${dto.jobListingId}" not found.`);
      }
      company = job.employer;
      role = job.title;
      city = job.city;

      // Prevent duplicate tracking of the same listing
      const existing = await this.prisma.jobApplication.findFirst({
        where: { userId, jobListingId: dto.jobListingId },
      });
      if (existing) {
        throw new BadRequestException('You are already tracking an application for this vacancy.');
      }
    }

    const status = dto.status || JobApplicationStatus.APPLIED;

    return this.prisma.$transaction(async (tx) => {
      const application = await tx.jobApplication.create({
        data: {
          userId,
          jobListingId: dto.jobListingId,
          customCompany: company,
          customRole: role,
          city,
          status,
          appliedAt: dto.appliedAt || new Date(),
          interviewDate: dto.interviewDate,
          contactPerson: dto.contactPerson,
          contactEmail: dto.contactEmail,
          salaryOfferCents: dto.salaryOfferCents,
          notes: dto.notes,
          nextFollowUpDate: dto.nextFollowUpDate,
        },
        include: {
          job: true,
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: null,
          toStatus: status,
          notes: 'Application created in tracker.',
        },
      });

      return application;
    });
  }

  /**
   * Lists all tracked applications for the student with pipeline metrics.
   */
  async listApplications(userId: string, statusFilter?: JobApplicationStatus) {
    const where: any = { userId };
    if (statusFilter) {
      where.status = statusFilter;
    }

    const [applications, allUserApplications] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        include: {
          job: true,
          statusHistory: {
            orderBy: { changedAt: 'desc' },
          },
        },
      }),
      this.prisma.jobApplication.findMany({
        where: { userId },
        select: { status: true },
      }),
    ]);

    // Pipeline metrics
    const metrics: Record<string, number> = {
      SAVED: 0,
      PLANNED: 0,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
      WITHDRAWN: 0,
    };

    for (const app of allUserApplications) {
      if (metrics[app.status] !== undefined) {
        metrics[app.status] += 1;
      }
    }

    return {
      applications,
      pipelineMetrics: metrics,
      totalTracked: allUserApplications.length,
    };
  }

  /**
   * Transitions an application stage (e.g. APPLIED -> INTERVIEW -> OFFER)
   * and appends an immutable timeline history entry.
   */
  async updateApplicationStatus(
    userId: string,
    applicationId: string,
    dto: UpdateApplicationStatusDto,
  ) {
    const app = await this.prisma.jobApplication.findFirst({
      where: { id: applicationId, userId },
    });

    if (!app) {
      throw new NotFoundException(`Application with ID "${applicationId}" was not found.`);
    }

    const fromStatus = app.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.jobApplication.update({
        where: { id: applicationId },
        data: {
          status: dto.status,
          interviewDate: dto.interviewDate ?? app.interviewDate,
          salaryOfferCents: dto.salaryOfferCents ?? app.salaryOfferCents,
          notes: dto.notes ?? app.notes,
          nextFollowUpDate: dto.nextFollowUpDate ?? app.nextFollowUpDate,
        },
        include: {
          job: true,
          statusHistory: {
            orderBy: { changedAt: 'desc' },
          },
        },
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          fromStatus,
          toStatus: dto.status,
          notes: dto.notes || `Stage updated from ${fromStatus} to ${dto.status}`,
        },
      });

      return updated;
    });
  }

  /**
   * Deletes an application from the tracker.
   */
  async deleteApplication(userId: string, applicationId: string) {
    const app = await this.prisma.jobApplication.findFirst({
      where: { id: applicationId, userId },
    });

    if (!app) {
      throw new NotFoundException(`Application with ID "${applicationId}" was not found.`);
    }

    await this.prisma.jobApplication.delete({
      where: { id: applicationId },
    });

    return { success: true, message: 'Application deleted from tracker.' };
  }
}
