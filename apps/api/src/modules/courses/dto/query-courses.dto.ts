import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryCoursesDto {
  @ApiPropertyOptional({
    example: 'Healthcare Terminology',
    description: 'Filter by category (e.g. Healthcare Terminology, IT & Engineering, General German, Career & Visa)',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'A1 Beginner',
    description: 'Filter by target proficiency level (e.g. A1 Beginner, B2 Specialized, All Levels, B1–B2)',
  })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Filter for free courses only (true/false)',
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isFree?: boolean;

  @ApiPropertyOptional({
    example: 'Medical',
    description: 'Search keyword across title, description, and instructor name',
  })
  @IsOptional()
  @IsString()
  search?: string;

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
    description: 'Number of courses per page (max 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number = 20;
}
