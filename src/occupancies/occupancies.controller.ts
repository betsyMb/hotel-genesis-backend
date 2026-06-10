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
import { OccupanciesService } from './occupancies.service';
import { CreateOccupancyDto } from './dto/create-occupancy.dto';
import { UpdateOccupancyDto } from './dto/update-occupancy.dto';
import { Occupancy } from './entities/occupancy.entity';

@ApiTags('occupancies')
@ApiBearerAuth()
@Controller('occupancies')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class OccupanciesController {
  constructor(private readonly occupanciesService: OccupanciesService) {}

  @Post()
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Create a new occupancy (Admin/Receptionist only)' })
  @ApiResponse({
    status: 201,
    description: 'Occupancy created successfully',
    type: Occupancy,
  })
  create(@Body() createOccupancyDto: CreateOccupancyDto) {
    return this.occupanciesService.create(createOccupancyDto);
  }

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager')
  @ApiOperation({ summary: 'Get all occupancies (Admin/Receptionist/Manager)' })
  @ApiResponse({
    status: 200,
    description: 'List of all occupancies',
    type: [Occupancy],
  })
  findAll() {
    return this.occupanciesService.findAll();
  }

  @Get(':id')
  @Roles('Administrator', 'Receptionist', 'Manager')
  @ApiOperation({
    summary: 'Get an occupancy by ID (Admin/Receptionist/Manager)',
  })
  @ApiParam({ name: 'id', description: 'Occupancy ID' })
  @ApiResponse({ status: 200, description: 'Occupancy found', type: Occupancy })
  @ApiResponse({ status: 404, description: 'Occupancy not found' })
  findOne(@Param('id') id: string) {
    return this.occupanciesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Update an occupancy (Admin/Receptionist only)' })
  @ApiParam({ name: 'id', description: 'Occupancy ID' })
  @ApiResponse({
    status: 200,
    description: 'Occupancy updated successfully',
    type: Occupancy,
  })
  @ApiResponse({ status: 404, description: 'Occupancy not found' })
  update(
    @Param('id') id: string,
    @Body() updateOccupancyDto: UpdateOccupancyDto,
  ) {
    return this.occupanciesService.update(+id, updateOccupancyDto);
  }

  @Delete(':id')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Delete an occupancy (Admin/Receptionist only)' })
  @ApiParam({ name: 'id', description: 'Occupancy ID' })
  @ApiResponse({ status: 200, description: 'Occupancy deleted successfully' })
  @ApiResponse({ status: 404, description: 'Occupancy not found' })
  remove(@Param('id') id: string) {
    return this.occupanciesService.remove(+id);
  }
}
