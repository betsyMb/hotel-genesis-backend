import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'Administrator', description: 'Role name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  role_name: string;
}
