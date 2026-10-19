import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'applicant@example.com', description: 'Account email address' })
  @IsEmail({}, { message: 'Must be a valid email address.' })
  @IsNotEmpty()
  email!: string;
}
