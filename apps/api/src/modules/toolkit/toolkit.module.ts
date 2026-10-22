import { Module } from '@nestjs/common';
import { ToolkitController } from './toolkit.controller.js';
import { ToolkitService } from './toolkit.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [ToolkitController],
  providers: [ToolkitService],
  exports: [ToolkitService],
})
export class ToolkitModule {}
