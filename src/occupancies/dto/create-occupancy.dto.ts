import {
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOccupancyDto {
  @ApiProperty({ example: 1, description: 'Reservation ID', required: false })
  @IsOptional()
  @IsInt()
  id_reservation?: number | null;

  @ApiProperty({ example: 1, description: 'Room ID' })
  @IsInt()
  @IsNotEmpty()
  id_room: number;

  @ApiProperty({ example: '2026-05-01T15:00:00Z', description: 'Actual check-in date' })
  @IsNotEmpty()
  actual_check_in: Date;

  @ApiProperty({ example: '2026-05-05T11:00:00Z', description: 'Actual check-out date', required: false })
  @IsOptional()
  actual_check_out?: Date;

  @ApiProperty({ example: 'active', description: 'Occupancy status', enum: ['active', 'completed', 'no_show'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'completed', 'no_show'])
  occupancy_status?: string;

  @ApiProperty({ example: 'Guest signature here', description: 'Guest signature', required: false })
  @IsOptional()
  @IsString()
  guest_signature?: string;

  @ApiProperty({ example: 120.00, description: 'Total amount in USD', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount?: number;

  @ApiProperty({ example: 1200.00, description: 'Total amount in Bs (at transaction time)', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount_bs?: number;
}
