import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsBoolean,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Breakfast Buffet', description: 'Service name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  service_name: string;

  @ApiProperty({
    example: 'International breakfast buffet',
    description: 'Service description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 15.0, description: 'Service price' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: true,
    description: 'Is service active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
