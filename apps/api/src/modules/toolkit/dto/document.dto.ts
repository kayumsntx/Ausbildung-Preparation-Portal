import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum DocumentCategory {
  LANGUAGE_CERTIFICATE = 'LANGUAGE_CERTIFICATE',
  SCHOOL_TRANSCRIPT = 'SCHOOL_TRANSCRIPT',
  PASSPORT = 'PASSPORT',
  WORK_REFERENCE = 'WORK_REFERENCE',
  OTHER = 'OTHER',
}

export const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_DOCUMENT_SIZE_BYTES = 15 * 1024 * 1024; // 15 Megabytes

export class UploadDocumentDto {
  @ApiProperty({ example: 'Goethe-Zertifikat B2 Gesamtergebnis' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({
    enum: DocumentCategory,
    example: DocumentCategory.LANGUAGE_CERTIFICATE,
    description: 'Vault classification category',
  })
  @IsNotEmpty()
  @IsEnum(DocumentCategory)
  category!: DocumentCategory;

  @ApiProperty({ example: 'Goethe_B2_Certificate_Max_Mustermann.pdf' })
  @IsNotEmpty()
  @IsString()
  fileName!: string;

  @ApiProperty({ example: 2450800, description: 'File size in bytes (max 15MB)' })
  @IsInt()
  @Min(1)
  @Max(MAX_DOCUMENT_SIZE_BYTES)
  fileSize!: number;

  @ApiProperty({
    example: 'application/pdf',
    description: 'Allowed: application/pdf, image/jpeg, image/png, image/webp',
  })
  @IsNotEmpty()
  @IsIn(ALLOWED_MIME_TYPES)
  mimeType!: string;

  @ApiProperty({ example: 'https://storage.ausbildung-portal.de/vault/docs/goethe-b2.pdf' })
  @IsNotEmpty()
  @IsString()
  fileUrl!: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
