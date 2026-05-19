import { Controller, Get, Post, Body, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { WalkinService } from './walkin.service';
import { CheckInDto } from './dto/checkin.dto';
import { CheckOutDto } from './dto/checkout.dto';

@ApiTags('walkin')
@ApiBearerAuth()
@Controller('walkin')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
@UseGuards(JwtAuthGuard, RolesGuard)
export class WalkinController {
  constructor(private readonly walkinService: WalkinService) {}

  @Post('checkin')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Walk-in check-in: register a guest without prior reservation' })
  @ApiResponse({ status: 201, description: 'Check-in successful' })
  @ApiResponse({ status: 409, description: 'Room is not available' })
  checkin(@Body() dto: CheckInDto) {
    return this.walkinService.checkin(dto);
  }

  @Get('history')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Get walk-in check-in/out history' })
  @ApiResponse({ status: 200, description: 'Returns completed walk-in occupancies' })
  history() {
    return this.walkinService.getHistory();
  }

  @Post('checkout')
  @Roles('Administrator', 'Receptionist')
  @ApiOperation({ summary: 'Walk-in check-out: complete an active walk-in occupancy' })
  @ApiResponse({ status: 200, description: 'Check-out successful' })
  @ApiResponse({ status: 404, description: 'No active occupancy found for this room' })
  checkout(@Body() dto: CheckOutDto) {
    return this.walkinService.checkout(dto);
  }
}
