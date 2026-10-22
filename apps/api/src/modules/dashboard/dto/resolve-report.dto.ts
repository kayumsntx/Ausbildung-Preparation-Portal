import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ModerationResolutionAction {
  DISMISS = 'DISMISS',
  WARN = 'WARN',
  SUSPEND_USER = 'SUSPEND_USER',
}

export class ResolveReportDto {
  @ApiProperty({
    enum: ModerationResolutionAction,
    description: 'Disciplinary or resolution action taken on the reported incident',
    example: ModerationResolutionAction.SUSPEND_USER,
  })
  @IsEnum(ModerationResolutionAction)
  @IsNotEmpty()
  action!: ModerationResolutionAction;

  @ApiProperty({
    description: 'Administrative notes and justification for the resolution decision',
    example: 'Confirmed harassment during WebRTC session. Account suspended and sessions terminated.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  notes!: string;
}
