import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export enum ChecklistCategory {
  EMBASSY_VISA = 'EMBASSY_VISA',
  INTERVIEW_PREP = 'INTERVIEW_PREP',
  DOCUMENT_AUTHENTICATION = 'DOCUMENT_AUTHENTICATION',
}

export class CreateChecklistItemDto {
  @ApiProperty({
    enum: ChecklistCategory,
    example: ChecklistCategory.EMBASSY_VISA,
  })
  @IsNotEmpty()
  @IsEnum(ChecklistCategory)
  category!: ChecklistCategory;

  @ApiProperty({ example: 'Sperrkonto oder Finanzierungsnachweis eröffnen' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiPropertyOptional({
    example: 'Nachweis über ausreichende finanzielle Mittel gem. § 16a AufenthG falls Gehalt unter Mindestsatz liegt.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '2026-12-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 3, default: 1 })
  @IsOptional()
  @IsInt()
  sequenceOrder?: number;
}

export class UpdateChecklistItemDto {
  @ApiPropertyOptional({ example: 'Reisepass Gültigkeit prüfen' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'Mindestens 2 freie Seiten für Visum D' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @ApiPropertyOptional({ example: '2026-11-15T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  sequenceOrder?: number;
}
