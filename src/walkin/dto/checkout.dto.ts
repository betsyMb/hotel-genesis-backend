import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CheckOutDto {
  @ApiProperty({ example: 1, description: 'Room ID to check out' })
  @IsInt()
  @Min(1)
  room_id: number;
}
