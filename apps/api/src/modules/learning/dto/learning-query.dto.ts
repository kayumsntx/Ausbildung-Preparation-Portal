import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export enum CefrLevelFilter {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
}

export class GetModulesQueryDto {
  @ApiPropertyOptional({
    enum: CefrLevelFilter,
    description: 'Filter modules by CEFR level code (A1, A2, B1, B2)',
  })
  @IsOptional()
  @IsEnum(CefrLevelFilter, { message: 'levelCode must be one of: A1, A2, B1, B2.' })
  levelCode?: CefrLevelFilter;

  @ApiPropertyOptional({
    example: 'en',
    description: 'Preferred translation language: bn (Bengali), en (English), de (German)',
  })
  @IsOptional()
  @IsString()
  locale?: string;
}

export class GetVocabularyQueryDto {
  @ApiPropertyOptional({
    description: 'Filter vocabulary by specific lesson UUID',
  })
  @IsOptional()
  @IsString()
  lessonId?: string;

  @ApiPropertyOptional({
    example: 'Ausbildung',
    description: 'Search by German word or translation',
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
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    description: 'Number of items per page (max 100)',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 20;
}
