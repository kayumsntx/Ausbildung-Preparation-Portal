import { Module } from '@nestjs/common';
import { SpeakingController } from './speaking.controller.js';
import { SpeakingService } from './speaking.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SpeakingController],
  providers: [SpeakingService],
  exports: [SpeakingService],
})
export class SpeakingModule {}
