import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ValidateNested,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GuestDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({ example: '12345678A', description: 'DNI / ID number' })
  @IsString()
  @IsNotEmpty()
  dni: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiPropertyOptional({ example: 'guest@email.com', description: 'Email address' })
  @IsOptional()
  @IsString()
  email?: string;
}

export class CheckInDto {
  @ApiProperty({ example: 1, description: 'Room ID' })
  @IsInt()
  @Min(1)
  room_id: number;

  @ApiProperty({ description: 'Main guest information' })
  @ValidateNested()
  @Type(() => GuestDto)
  guest: GuestDto;

  @ApiPropertyOptional({
    description: 'Additional guests staying in the room',
    type: [GuestDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GuestDto)
  additional_guests?: GuestDto[];

  @ApiPropertyOptional({
    example: 'nightly',
    description: 'Service type',
    enum: ['nightly', '3hours'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['nightly', '3hours'])
  service_type?: string;
}
