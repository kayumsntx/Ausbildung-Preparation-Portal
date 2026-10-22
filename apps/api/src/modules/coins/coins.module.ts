import { Module } from '@nestjs/common';
import { CoinsController } from './coins.controller.js';
import { CoinsService } from './coins.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CoinsController],
  providers: [CoinsService],
  exports: [CoinsService],
})
export class CoinsModule {}
