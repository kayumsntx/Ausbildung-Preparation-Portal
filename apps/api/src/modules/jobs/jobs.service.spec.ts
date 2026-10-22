import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { JobsService } from './jobs.service.js';
import { BundesagenturJobsucheService } from './bundesagentur.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { JobApplicationStatus } from '@prisma/client';

describe('JobsService Integration & Pipeline Tests', () => {
  let prisma: PrismaService;
  let bundesagenturService: BundesagenturJobsucheService;
  let jobsService: JobsService;
  let testUserId: string;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
    bundesagenturService = new BundesagenturJobsucheService(prisma);
    jobsService = new JobsService(prisma, bundesagenturService);

    // Create a temporary test user
    const testUser = await prisma.user.create({
      data: {
        email: `jobs.test.${Date.now()}@example.com`,
        passwordHash: 'test_hash_for_jobs_service',
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

  it('1. should search and filter Ausbildung listings by keyword and city', async () => {
    const allJobs = await jobsService.searchJobs({ page: 1, limit: 10 }, testUserId);
    expect(allJobs.items).toBeDefined();
    expect(allJobs.items.length).toBeGreaterThanOrEqual(6);

    const berlinJobs = await jobsService.searchJobs({ page: 1, limit: 10, city: 'Berlin' }, testUserId);
    expect(berlinJobs.items.some((j) => j.city.toLowerCase().includes('berlin'))).toBe(true);

    const itJobs = await jobsService.searchJobs({ page: 1, limit: 10, category: 'IT & Software' }, testUserId);
    expect(itJobs.items.some((j) => j.employer.includes('SAP'))).toBe(true);
  });

  it('2. should retrieve full job details and handle non-existent IDs with NotFoundException', async () => {
    const firstJob = await prisma.jobListing.findFirst();
    expect(firstJob).toBeDefined();

    const detail = await jobsService.getJobById(firstJob!.id, testUserId);
    expect(detail.id).toBe(firstJob!.id);
    expect(detail.description).toBeDefined();
    expect(detail.isSaved).toBe(false);

    await expect(jobsService.getJobById('non-existent-uuid-1234', testUserId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('3. should toggle job bookmark on and off', async () => {
    const job = await prisma.jobListing.findFirst();
    expect(job).toBeDefined();

    // 1st toggle: save
    const saveRes = await jobsService.toggleSaveJob(testUserId, job!.id, {
      notes: 'Strong candidate for visa application',
    });
    expect(saveRes.saved).toBe(true);

    const savedList = await jobsService.getSavedJobs(testUserId);
    expect(savedList.some((s) => s.job.id === job!.id)).toBe(true);

    // 2nd toggle: unsave
    const unsaveRes = await jobsService.toggleSaveJob(testUserId, job!.id);
    expect(unsaveRes.saved).toBe(false);

    const savedListAfter = await jobsService.getSavedJobs(testUserId);
    expect(savedListAfter.some((s) => s.job.id === job!.id)).toBe(false);
  });

  it('4. should track an application, record status history, and prevent duplicate tracking', async () => {
    const job = await prisma.jobListing.findFirst();
    expect(job).toBeDefined();

    const application = await jobsService.createApplication(testUserId, {
      jobListingId: job!.id,
      notes: 'Submitted cover letter conforming to DIN 5008 standards.',
    });

    expect(application).toBeDefined();
    expect(application.status).toBe(JobApplicationStatus.APPLIED);
    expect(application.jobListingId).toBe(job!.id);

    // Duplicate check
    await expect(
      jobsService.createApplication(testUserId, { jobListingId: job!.id }),
    ).rejects.toThrow(BadRequestException);

    // Verify status history
    const history = await prisma.applicationStatusHistory.findMany({
      where: { applicationId: application.id },
    });
    expect(history.length).toBe(1);
    expect(history[0].toStatus).toBe(JobApplicationStatus.APPLIED);
  });

  it('5. should transition application stage and update timeline metrics', async () => {
    const application = await prisma.jobApplication.findFirst({
      where: { userId: testUserId },
    });
    expect(application).toBeDefined();

    const interviewDate = new Date(Date.now() + 7 * 86400000);
    const updated = await jobsService.updateApplicationStatus(testUserId, application!.id, {
      status: JobApplicationStatus.INTERVIEW,
      interviewDate,
      notes: 'Video interview confirmed with Head of HR.',
    });

    expect(updated.status).toBe(JobApplicationStatus.INTERVIEW);
    expect(new Date(updated.interviewDate!).toISOString()).toBe(interviewDate.toISOString());

    // Verify pipeline metrics reflect the new stage
    const pipeline = await jobsService.listApplications(testUserId);
    expect(pipeline.pipelineMetrics.INTERVIEW).toBeGreaterThanOrEqual(1);
    expect(pipeline.totalTracked).toBeGreaterThanOrEqual(1);
  });

  it('6. should allow tracking custom off-portal applications and clean deletion', async () => {
    const manualApp = await jobsService.createApplication(testUserId, {
      customCompany: 'Porsche AG',
      customRole: 'Ausbildung Kfz-Mechatroniker',
      city: 'Stuttgart',
      status: JobApplicationStatus.PLANNED,
    });

    expect(manualApp.customCompany).toBe('Porsche AG');
    expect(manualApp.status).toBe(JobApplicationStatus.PLANNED);

    // Delete custom application
    const delRes = await jobsService.deleteApplication(testUserId, manualApp.id);
    expect(delRes.success).toBe(true);

    const check = await prisma.jobApplication.findUnique({ where: { id: manualApp.id } });
    expect(check).toBeNull();
  });
});
