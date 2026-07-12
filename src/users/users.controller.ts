import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Create a new user (Admin/Receptionist only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: User,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error: any) {
      if (error.code === '23505') throw new BadRequestException('El email o DNI ya está registrado');
      throw new InternalServerErrorException(error.message || 'Error al crear usuario');
    }
  }

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager')
  @ApiOperation({ summary: 'Get all users (Admin/Receptionist/Manager)' })
  @ApiResponse({ status: 200, description: 'List of all users', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles('Administrator', 'Receptionist', 'Manager')
  @ApiOperation({ summary: 'Get a user by ID (Admin/Receptionist/Manager)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrator', 'Receptionist', 'Client')
  @ApiOperation({
    summary: 'Update a user (Admin/Receptionist/self Client only)',
  })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: any,
  ) {
    try {
      if (req.user.role === 'Client' && Number(req.user.id_user) !== Number(id)) {
        throw new ForbiddenException('No puedes editar otro usuario');
      }
      return await this.usersService.update(+id, updateUserDto);
    } catch (error: any) {
      if (error instanceof ForbiddenException) throw error;
      if (error.code === '23505') throw new BadRequestException('El email o DNI ya está registrado');
      throw new InternalServerErrorException(error.message || 'Error al actualizar usuario');
    }
  }

  @Patch(':id/password')
  @ApiOperation({ summary: 'Update user password only' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Password updated', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: any,
  ) {
    try {
      const userId = Number(id);
      if (req.user.role === 'Client' && Number(req.user.id_user) !== userId) {
        throw new ForbiddenException('No puedes cambiar la contraseña de otro usuario');
      }
      const currentPassword = req.user.role === 'Client' ? updatePasswordDto.currentPassword : undefined;
      if (req.user.role === 'Client' && !currentPassword) {
        throw new BadRequestException('Debes proporcionar tu contraseña actual');
      }
      return await this.usersService.updatePassword(userId, updatePasswordDto.password, currentPassword);
    } catch (error: any) {
      if (error instanceof ForbiddenException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message || 'Error al cambiar contraseña');
    }
  }

  @Delete(':id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Delete a user (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      return await this.usersService.remove(+id);
    } catch (error: any) {
      if (error.code === '23503') throw new BadRequestException('No se puede eliminar: el usuario tiene reservas u otros registros asociados');
      throw new InternalServerErrorException(error.message || 'Error al eliminar usuario');
    }
  }
}
