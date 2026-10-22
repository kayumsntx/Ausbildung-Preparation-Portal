import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CompleteLessonDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'UUID of the CourseLesson being completed',
  })
  @IsUUID('4', { message: 'lessonId must be a valid UUIDv4.' })
  @IsNotEmpty()
  lessonId!: string;
}
