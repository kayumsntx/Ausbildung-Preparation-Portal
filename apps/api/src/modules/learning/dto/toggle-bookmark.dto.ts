import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class ToggleBookmarkDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the lesson to bookmark (mutually exclusive or combined with vocabularyId)',
  })
  @IsOptional()
  @IsUUID('4', { message: 'lessonId must be a valid UUIDv4.' })
  lessonId?: string;

  @ApiPropertyOptional({
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'UUID of the vocabulary item to bookmark',
  })
  @IsOptional()
  @IsUUID('4', { message: 'vocabularyId must be a valid UUIDv4.' })
  vocabularyId?: string;

  @ApiPropertyOptional({
    example: 'Crucial phrase for the hospital nursing interview',
    description: 'Optional personal study notes attached to bookmark',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes must not exceed 500 characters.' })
  notes?: string;
}
