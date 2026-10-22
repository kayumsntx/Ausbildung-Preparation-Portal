import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class SubmitRatingDto {
  @ApiProperty({ example: 5, description: 'Overall conversation rating (1 to 5 stars)' })
  @IsInt()
  @Min(1)
  @Max(5)
  stars!: number;

  @ApiPropertyOptional({ example: 4, description: 'German fluency score (1 to 5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  fluencyScore?: number;

  @ApiPropertyOptional({ example: 5, description: 'Punctuality & etiquette score (1 to 5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  punctualityScore?: number;

  @ApiPropertyOptional({
    example: 'SEHR_FREUNDLICH',
    description: 'Complimentary badge e.g. SEHR_FREUNDLICH, GUTE_AUSSPRACHE, HILFREICH',
  })
  @IsOptional()
  @IsString()
  badge?: string;

  @ApiPropertyOptional({
    example: 'Tolle Aussprache und sehr geduldig beim Korrigieren der Grammatik!',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  comment?: string;
}
