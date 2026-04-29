import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, MaxLength, MinLength, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  full_name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'hashed_password_here', description: 'Hashed password' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password_hash: string;

  @ApiProperty({ example: 1, description: 'Role ID' })
  @IsInt()
  @IsNotEmpty()
  id_rol: number;

  @ApiProperty({ example: true, description: 'Is user active', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
