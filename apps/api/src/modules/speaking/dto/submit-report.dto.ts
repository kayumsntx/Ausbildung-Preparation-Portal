import { ApiProperty } from '@nestjs/swagger';
import { SpeakingReportReason } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SubmitReportDto {
  @ApiProperty({
    enum: SpeakingReportReason,
    example: SpeakingReportReason.INAPPROPRIATE_BEHAVIOR,
    description: 'Reason for flagging call or partner',
  })
  @IsNotEmpty()
  @IsEnum(SpeakingReportReason)
  reason!: SpeakingReportReason;

  @ApiProperty({
    example: 'Teilnehmer hat unangemessene persönliche Fragen gestellt.',
    description: 'Detailed description of incident for moderation review',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1000)
  details!: string;
}
