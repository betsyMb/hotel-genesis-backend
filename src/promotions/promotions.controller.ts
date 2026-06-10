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
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { Promotion } from './entities/promotion.entity';

@ApiTags('promotions')
@ApiBearerAuth()
@Controller('promotions')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  @Roles('Administrator', 'Manager')
  @ApiOperation({ summary: 'Create a new promotion (Admin/Manager only)' })
  @ApiResponse({
    status: 201,
    description: 'Promotion created successfully',
    type: Promotion,
  })
  create(@Body() createPromotionDto: CreatePromotionDto) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get all promotions (All authenticated users)' })
  @ApiResponse({
    status: 200,
    description: 'List of all promotions',
    type: [Promotion],
  })
  findAll() {
    return this.promotionsService.findAll();
  }

  @Get(':id')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client')
  @ApiOperation({ summary: 'Get a promotion by ID (All authenticated users)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ status: 200, description: 'Promotion found', type: Promotion })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  findOne(@Param('id') id: string) {
    return this.promotionsService.findOne(+id);
  }

  @Patch(':id')
  @Roles('Administrator', 'Manager')
  @ApiOperation({ summary: 'Update a promotion (Admin/Manager only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({
    status: 200,
    description: 'Promotion updated successfully',
    type: Promotion,
  })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  update(
    @Param('id') id: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(+id, updatePromotionDto);
  }

  @Delete(':id')
  @Roles('Administrator')
  @ApiOperation({ summary: 'Delete a promotion (Admin only)' })
  @ApiParam({ name: 'id', description: 'Promotion ID' })
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  remove(@Param('id') id: string) {
    return this.promotionsService.remove(+id);
  }
}
