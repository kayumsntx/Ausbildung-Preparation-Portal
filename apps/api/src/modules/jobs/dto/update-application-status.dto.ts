import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { JobApplicationStatus } from '@prisma/client';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: JobApplicationStatus,
    example: JobApplicationStatus.INTERVIEW,
    description: 'New stage for the application',
  })
  @IsEnum(JobApplicationStatus)
  @IsNotEmpty()
  status!: JobApplicationStatus;

  @ApiPropertyOptional({
    example: 'Invited to technical video interview on Teams.',
    description: 'Transition reason or updated interview notes',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @ApiPropertyOptional({
    example: '2026-11-10T10:00:00.000Z',
    description: 'Interview date if scheduled',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  interviewDate?: Date;

  @ApiPropertyOptional({
    example: 115000,
    description: 'Salary/stipend offer in cents if status is OFFER',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  salaryOfferCents?: number;

  @ApiPropertyOptional({
    example: '2026-11-15T09:00:00.000Z',
    description: 'Next follow-up reminder date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  nextFollowUpDate?: Date;
}
