import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

@ApiTags('services')
@ApiBearerAuth()
@Controller('services')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles('Administrator', 'Manager')
  @ApiOperation({ summary: 'Create a new service (Admin/Manager only)' })
  @ApiResponse({ status: 201, description: 'Service created successfully', type: Service })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get all services (All authenticated users)' })
  @ApiResponse({ status: 200, description: 'List of all services', type: [Service] })
  findAll() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get a service by ID (All authenticated users)' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service found', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrator', 'Manager')
  @ApiOperation({ summary: 'Update a service (Admin/Manager only)' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service updated successfully', type: Service })
  @ApiResponse({ status: 404, description: 'Service not found' })
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(+id, updateServiceDto);
  }

  @Delete(':id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Delete a service (Admin only)' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 200, description: 'Service deleted successfully' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(+id);
  }
}
