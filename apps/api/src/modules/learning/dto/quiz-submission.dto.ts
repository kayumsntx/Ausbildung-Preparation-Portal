import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class QuizAnswerItemDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the QuizQuestion being answered',
  })
  @IsUUID('4', { message: 'questionId must be a valid UUIDv4.' })
  @IsNotEmpty()
  questionId!: string;

  @ApiProperty({
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    description: 'UUID of the selected QuizOption',
  })
  @IsUUID('4', { message: 'selectedOptionId must be a valid UUIDv4.' })
  @IsNotEmpty()
  selectedOptionId!: string;
}

export class QuizSubmissionDto {
  @ApiProperty({
    type: [QuizAnswerItemDto],
    description: 'Array of user submitted question-option answer pairs',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerItemDto)
  answers!: QuizAnswerItemDto[];
}
