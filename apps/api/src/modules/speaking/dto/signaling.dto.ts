import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsObject } from 'class-validator';

export class SendSignalingMessageDto {
  @ApiProperty({
    example: 'offer',
    description: 'WebRTC signaling signal type: offer, answer, ice-candidate, leave',
  })
  @IsNotEmpty()
  @IsIn(['offer', 'answer', 'ice-candidate', 'leave'])
  type!: string;

  @ApiProperty({
    example: { sdp: 'v=0\r\no=- 123456...', type: 'offer' },
    description: 'SDP description object or ICE candidate payload',
  })
  @IsNotEmpty()
  @IsObject()
  payload!: Record<string, any>;
}

export class SignalingEnvelope {
  @ApiProperty({ example: 'user-uuid-sender' })
  senderId!: string;

  @ApiProperty({ example: 'offer' })
  type!: string;

  @ApiProperty()
  payload!: Record<string, any>;

  @ApiProperty({ example: 1729598400000 })
  timestamp!: number;
}
