import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckOutDto {
  @ApiProperty({ example: 1, description: 'Room ID to check out' })
  @IsInt()
  @Min(1)
  room_id: number;

  @ApiPropertyOptional({ example: 120.0, description: 'Total amount in USD' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @ApiPropertyOptional({
    example: 1200.0,
    description: 'Total amount in Bs (at transaction time)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount_bs?: number;
}
