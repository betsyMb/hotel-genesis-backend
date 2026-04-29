import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@ApiTags('rooms')
@ApiBearerAuth()
@Controller('rooms')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles('Administrator', 'Manager')
  @ApiOperation({ summary: 'Create a new room (Admin/Manager only)' })
  @ApiResponse({ status: 201, description: 'Room created successfully', type: Room })
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get all rooms (All authenticated users)' })
  @ApiResponse({ status: 200, description: 'List of all rooms', type: [Room] })
  findAll() {
    return this.roomsService.findAll();
  }

  @Get(':id')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get a room by ID (All authenticated users)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room found', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrator', 'Manager')
  @ApiOperation({ summary: 'Update a room (Admin/Manager only)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room updated successfully', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Delete a room (Admin only)' })
  @ApiParam({ name: 'id', description: 'Room ID' })
  @ApiResponse({ status: 200, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
