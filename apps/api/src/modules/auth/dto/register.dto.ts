import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'applicant@example.com', description: 'Unique user email address' })
  @IsEmail({}, { message: 'Must be a valid email address.' })
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Password with min 8 characters' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  password!: string;

  @ApiPropertyOptional({ example: 'Tanvir', description: 'Applicant first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Hasan', description: 'Applicant last name' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ example: 'Pflegefachmann (Nursing)', description: 'Target vocational discipline' })
  @IsOptional()
  @IsString()
  targetAusbildungField?: string;

  @ApiPropertyOptional({ example: 'bn', description: 'Preferred language: bn, en, or de' })
  @IsOptional()
  @Matches(/^(bn|en|de)$/, { message: 'Preferred language must be bn, en, or de.' })
  preferredLanguage?: string;

  @ApiPropertyOptional({ example: 'FRIEND50', description: 'Optional referral code' })
  @IsOptional()
  @IsString()
  referralCode?: string;
}
