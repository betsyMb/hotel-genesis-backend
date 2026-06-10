import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsIn,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 1, description: 'Client ID' })
  @IsInt()
  @IsNotEmpty()
  id_client: number;

  @ApiProperty({ example: 1, description: 'Room ID' })
  @IsInt()
  @IsNotEmpty()
  id_room: number;

  @ApiProperty({
    example: '2026-05-01',
    description: 'Check-in date (ISO string or YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  check_in_date: string;

  @ApiProperty({
    example: '2026-05-05',
    description: 'Check-out date (ISO string or YYYY-MM-DD)',
  })
  @IsString()
  @IsNotEmpty()
  check_out_date: string;

  @ApiProperty({ example: 2, description: 'Number of guests', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  number_of_guests?: number;

  @ApiProperty({
    example: 'pending',
    description: 'Reservation status',
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'confirmed', 'cancelled', 'completed', 'no_show'])
  reservation_status?: string;

  @ApiProperty({ example: 320.0, description: 'Total amount in USD' })
  @IsNumber()
  @Min(0)
  total_amount: number;

  @ApiProperty({
    example: 3200.0,
    description: 'Total amount in Bs (at transaction time)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  total_amount_bs?: number;

  @ApiProperty({
    example: 'Late arrival',
    description: 'Notes',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 'nightly',
    description: 'Service type',
    enum: ['nightly', '3hours'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['nightly', '3hours'])
  service_type?: string;
}
