import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'a9b8c7d6e5f4...', description: 'Cryptographic email verification token' })
  @IsString()
  @IsNotEmpty()
  token!: string;
}
