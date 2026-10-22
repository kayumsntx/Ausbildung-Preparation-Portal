import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { CefrLevel } from '@prisma/client';

export class SearchJobsQueryDto {
  @ApiPropertyOptional({
    example: 'Pflege',
    description: 'Search keyword across job title, description, and employer',
  })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({
    example: 'Berlin',
    description: 'Filter by city or region',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'Healthcare / Nursing',
    description: 'Filter by vocational industry category',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    enum: CefrLevel,
    example: 'B1',
    description: 'Maximum required German language level (A1, A2, B1, B2)',
  })
  @IsOptional()
  @IsEnum(CefrLevel, { message: 'requiredGermanLevel must be A1, A2, B1, B2, C1, or C2.' })
  requiredGermanLevel?: CefrLevel;

  @ApiPropertyOptional({
    example: 100000,
    description: 'Minimum 1st-year monthly stipend in integer cents (e.g. 100000 = €1,000.00)',
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  minStipendCents?: number;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    description: 'Pagination page number',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    description: 'Number of listings per page (max 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 20;
}
