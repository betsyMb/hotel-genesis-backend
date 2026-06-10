import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created', type: Reservation })
  create(@Body() dto: CreateReservationDto, @CurrentUser() user: any) {
    if (user?.role === 'Client') {
      dto.id_client = user.id_user;
    }
    return this.reservationsService.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({ status: 200, description: 'List of reservations', type: [Reservation] })
  findAll(@CurrentUser() user: any) {
    if (user.role === 'Client') {
      return this.reservationsService.findByClient(user.id_user);
    }
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get a reservation by ID' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation found', type: Reservation })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role === 'Client') {
      return this.reservationsService.findByClientAndId(+id, user.id_user);
    }
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator', 'Receptionist', 'Client')
  @ApiOperation({ summary: 'Update a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation updated', type: Reservation })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateReservationDto, @CurrentUser() user: any) {
    if (user.role === 'Client') {
      return this.reservationsService.updateByClient(+id, dto, user.id_user);
    }
    return this.reservationsService.update(+id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrator', 'Receptionist', 'Client')
  @ApiOperation({ summary: 'Delete a reservation' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation deleted' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role === 'Client') {
      return this.reservationsService.removeByClient(+id, user.id_user);
    }
    return this.reservationsService.remove(+id);
  }
}
