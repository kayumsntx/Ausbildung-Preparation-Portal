import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AdminAdjustCoinsDto {
  @ApiProperty({ example: 'user-uuid-123' })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiProperty({ example: 100, description: 'Positive amount to credit, negative to debit' })
  @IsNotEmpty()
  @IsInt()
  amount!: number;

  @ApiProperty({ example: 'Goodwill gesture after technical outage in speaking room' })
  @IsNotEmpty()
  @IsString()
  reason!: string;
}
