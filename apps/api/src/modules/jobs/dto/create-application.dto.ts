import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { JobApplicationStatus } from '@prisma/client';

export class CreateApplicationDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of an existing JobListing if applying through portal catalog',
  })
  @IsOptional()
  @IsUUID('4', { message: 'jobListingId must be a valid UUIDv4.' })
  jobListingId?: string;

  @ApiPropertyOptional({
    example: 'Bosch GmbH',
    description: 'Company name if manually tracking off-portal application',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  customCompany?: string;

  @ApiPropertyOptional({
    example: 'Ausbildung Industriemechaniker (m/w/d)',
    description: 'Target role title if manually tracking off-portal application',
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  customRole?: string;

  @ApiPropertyOptional({
    example: 'Stuttgart',
    description: 'City of the employer',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    enum: JobApplicationStatus,
    default: JobApplicationStatus.APPLIED,
    description: 'Current stage in the application pipeline',
  })
  @IsOptional()
  @IsEnum(JobApplicationStatus)
  status?: JobApplicationStatus = JobApplicationStatus.APPLIED;

  @ApiPropertyOptional({
    example: '2026-10-20T10:00:00.000Z',
    description: 'Date when the application was sent',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  appliedAt?: Date;

  @ApiPropertyOptional({
    example: '2026-11-05T14:30:00.000Z',
    description: 'Scheduled interview date & time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  interviewDate?: Date;

  @ApiPropertyOptional({
    example: 'Frau Schmidt',
    description: 'HR or interviewer contact person',
  })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({
    example: 'bewerbung@bosch.de',
    description: 'Employer contact email',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    example: 110000,
    description: 'Offered monthly stipend in integer cents (e.g. 110000 = €1,100)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  salaryOfferCents?: number;

  @ApiPropertyOptional({
    example: 'Cover letter submitted via email with DIN 5008 CV.',
    description: 'Personal notes and reminders',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({
    example: '2026-11-01T09:00:00.000Z',
    description: 'Follow-up reminder date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextFollowUpDate?: Date;
}
