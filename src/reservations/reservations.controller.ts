import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

@ApiTags('reservations')
@ApiBearerAuth()
@Controller('reservations')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles('Administrator', 'Receptionist', 'Client')
  @ApiOperation({ summary: 'Create a new reservation (Admin/Receptionist/Client)' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully', type: Reservation })
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager')
  @ApiOperation({ summary: 'Get all reservations (Admin/Receptionist/Manager)' })
  @ApiResponse({ status: 200, description: 'List of all reservations', type: [Reservation] })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get a reservation by ID (All authenticated users)' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation found', type: Reservation })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Update a reservation (Admin/Receptionist only)' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation updated successfully', type: Reservation })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  update(@Param('id') id: string, @Body() updateReservationDto: UpdateReservationDto) {
    return this.reservationsService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Delete a reservation (Admin/Receptionist only)' })
  @ApiParam({ name: 'id', description: 'Reservation ID' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  @ApiResponse({ status: 404, description: 'Reservation not found' })
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }
}
