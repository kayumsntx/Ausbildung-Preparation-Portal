import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SaveJobDto {
  @ApiPropertyOptional({
    example: 'Great location near subway and offers B2 language support.',
    description: 'Personal note attached to saved job',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
