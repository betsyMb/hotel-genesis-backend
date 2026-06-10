import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDate,
  Min,
  Max,
  IsBoolean,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty({ example: 'WELCOME10', description: 'Promotion code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  promotion_code: string;

  @ApiProperty({
    example: '10% off for new guests',
    description: 'Description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 10.0,
    description: 'Discount percent (0-100)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount_percent?: number;

  @ApiProperty({
    example: 50.0,
    description: 'Discount amount',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_amount?: number;

  @ApiProperty({ example: '2026-01-01', description: 'Start date' })
  @IsNotEmpty()
  start_date: Date;

  @ApiProperty({ example: '2026-12-31', description: 'End date' })
  @IsNotEmpty()
  end_date: Date;

  @ApiProperty({ example: 2, description: 'Minimum nights', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  min_nights?: number;

  @ApiProperty({ example: 100, description: 'Maximum usage', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  max_usage?: number;

  @ApiProperty({
    example: true,
    description: 'Is promotion active',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
