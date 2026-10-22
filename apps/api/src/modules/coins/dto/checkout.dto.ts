import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CoinPackageId } from '../constants/coin-packages.constant.js';

export class CreateCheckoutDto {
  @ApiProperty({
    enum: CoinPackageId,
    example: CoinPackageId.PRO_350,
    description: 'Identifier of coin pack to purchase via Stripe',
  })
  @IsNotEmpty()
  @IsEnum(CoinPackageId)
  packageId!: CoinPackageId;

  @ApiPropertyOptional({
    example: 'https://ausbildung-portal.de/pricing?status=success',
    description: 'Redirect URL on successful Stripe checkout',
  })
  @IsOptional()
  @IsString()
  successUrl?: string;

  @ApiPropertyOptional({
    example: 'https://ausbildung-portal.de/pricing?status=cancelled',
    description: 'Redirect URL if user cancels checkout',
  })
  @IsOptional()
  @IsString()
  cancelUrl?: string;

  @ApiPropertyOptional({
    example: 'idem_coin_pack_350_user123',
    description: 'Client-provided idempotency key preventing duplicate payment intents',
  })
  @IsOptional()
  @IsString()
  idempotencyKey?: string;
}
