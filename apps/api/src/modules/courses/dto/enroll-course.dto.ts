import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class EnrollCourseDto {
  @ApiPropertyOptional({
    enum: PaymentMethod,
    default: PaymentMethod.FREE,
    description: 'Payment method for course: FREE (for zero-price courses), COINS (deducts virtual coins), or STRIPE (creates card checkout intent)',
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod = PaymentMethod.FREE;

  @ApiPropertyOptional({
    example: 'idem_c4789f21-72b1-419a-9e11-8278f24419ad',
    description: 'Unique client-generated idempotency key preventing duplicate orders',
  })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
