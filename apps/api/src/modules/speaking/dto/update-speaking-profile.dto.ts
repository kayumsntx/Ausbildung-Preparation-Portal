import { ApiPropertyOptional } from '@nestjs/swagger';
import { CefrLevel } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateSpeakingProfileDto {
  @ApiPropertyOptional({
    enum: CefrLevel,
    example: CefrLevel.B1,
    description: 'Current German CEFR speaking ability',
  })
  @IsOptional()
  @IsEnum(CefrLevel)
  cefrLevel?: CefrLevel;

  @ApiPropertyOptional({
    example: 'FEMALE',
    description: 'Gender identification for safety and partner matching: MALE, FEMALE, PREFER_NOT_TO_SAY',
  })
  @IsOptional()
  @IsIn(['MALE', 'FEMALE', 'PREFER_NOT_TO_SAY'])
  gender?: string;

  @ApiPropertyOptional({
    example: 'ANY',
    description: 'Partner preference: ANY, SAME_GENDER, FEMALE_ONLY',
  })
  @IsOptional()
  @IsIn(['ANY', 'SAME_GENDER', 'FEMALE_ONLY'])
  preferredGender?: string;

  @ApiPropertyOptional({ example: 'Bengali' })
  @IsOptional()
  @IsString()
  nativeLanguage?: string;

  @ApiPropertyOptional({ example: 'Pflegefachmann / Krankenpflege' })
  @IsOptional()
  @IsString()
  targetVocationalField?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiPropertyOptional({
    example: 'Bereite mich auf das B2 Goethe-Zertifikat und Bewerbungsgespräche an der Berliner Charité vor.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
