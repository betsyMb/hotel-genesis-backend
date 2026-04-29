import { IsString, IsNotEmpty, IsInt, IsNumber, IsOptional, IsBoolean, MaxLength, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomDto {
  @ApiProperty({ example: '101', description: 'Room number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  room_number: string;

  @ApiProperty({ example: 'simple', description: 'Room type', enum: ['simple', 'double', 'suite', 'family'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['simple', 'double', 'suite', 'family'])
  room_type: string;

  @ApiProperty({ example: 1, description: 'Floor number' })
  @IsInt()
  @IsNotEmpty()
  floor: number;

  @ApiProperty({ example: 80.00, description: 'Price per night' })
  @IsNumber()
  @Min(0.01)
  price_per_night: number;

  @ApiProperty({ example: 'Cozy single room', description: 'Room description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2, description: 'Room capacity', required: false })
  @IsOptional()
  @IsInt()
  capacity?: number;

  @ApiProperty({ example: 20, description: 'Square meters', required: false })
  @IsOptional()
  @IsInt()
  square_meters?: number;

  @ApiProperty({ example: true, description: 'Has view', required: false })
  @IsOptional()
  @IsBoolean()
  has_view?: boolean;

  @ApiProperty({ example: false, description: 'Has balcony', required: false })
  @IsOptional()
  @IsBoolean()
  has_balcony?: boolean;

  @ApiProperty({ example: 'available', description: 'Room status', enum: ['available', 'occupied', 'maintenance', 'reserved'], required: false })
  @IsOptional()
  @IsString()
  @IsIn(['available', 'occupied', 'maintenance', 'reserved'])
  room_status?: string;
}
