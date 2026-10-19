import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Tanvir' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Hasan' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'bn', description: 'Preferred language: bn, en, or de' })
  @IsOptional()
  @Matches(/^(bn|en|de)$/, { message: 'Preferred language must be bn, en, or de.' })
  preferredLanguage?: string;

  @ApiPropertyOptional({ example: 'Pflegefachmann (Nursing)' })
  @IsOptional()
  @IsString()
  targetAusbildungField?: string;

  @ApiPropertyOptional({ example: '+4915123456789' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;
}
