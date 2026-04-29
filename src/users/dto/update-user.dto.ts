import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ example: 'John Doe', description: 'Full name', required: false })
  full_name?: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address', required: false })
  email?: string;

  @ApiProperty({ example: 'hashed_password_here', description: 'Hashed password', required: false })
  password_hash?: string;

  @ApiProperty({ example: 1, description: 'Role ID', required: false })
  id_rol?: number;
}
