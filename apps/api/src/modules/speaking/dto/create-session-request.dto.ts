import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CefrLevel, SpeakingTopicCategory } from '@prisma/client';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Max,
  Min,
} from 'class-validator';

export class CreateSessionRequestDto {
  @ApiProperty({
    enum: CefrLevel,
    example: CefrLevel.B1,
    description: 'Target German proficiency level for this conversation drill',
  })
  @IsNotEmpty()
  @IsEnum(CefrLevel)
  targetLevel!: CefrLevel;

  @ApiPropertyOptional({
    enum: SpeakingTopicCategory,
    default: SpeakingTopicCategory.GENERAL_CONVERSATION,
    example: SpeakingTopicCategory.VOCATIONAL_INTERVIEW,
    description: 'Conversation context & situational role-play scenario',
  })
  @IsOptional()
  @IsEnum(SpeakingTopicCategory)
  topicCategory?: SpeakingTopicCategory = SpeakingTopicCategory.GENERAL_CONVERSATION;

  @ApiPropertyOptional({
    example: 'ANY',
    default: 'ANY',
    description: 'Gender filter for matched partner: ANY, SAME_GENDER, FEMALE_ONLY',
  })
  @IsOptional()
  @IsIn(['ANY', 'SAME_GENDER', 'FEMALE_ONLY'])
  genderPreference?: string = 'ANY';

  @ApiPropertyOptional({
    example: 15,
    default: 15,
    description: 'Duration of speaking drill in minutes (e.g. 10, 15, 20)',
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(45)
  durationMinutes?: number = 15;
}
