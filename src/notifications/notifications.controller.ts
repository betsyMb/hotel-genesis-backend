import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client', 'Maintenance')
  @ApiOperation({ summary: 'Get all notifications for current user' })
  findAll(@CurrentUser() user: any) {
    return this.notificationsService.findByUser(user.id_user);
  }

  @Get('unread-count')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client', 'Maintenance')
  @ApiOperation({ summary: 'Get unread notifications count' })
  async unreadCount(@CurrentUser() user: any) {
    const count = await this.notificationsService.getUnreadCount(user.id_user);
    return { count };
  }

  @Patch(':id/read')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client', 'Maintenance')
  @ApiOperation({ summary: 'Mark notification as read' })
  async markAsRead(@Param('id') id: string) {
    await this.notificationsService.markAsRead(+id);
    return { success: true };
  }

  @Patch('read-all')
  @Roles('Administrator', 'Receptionist', 'Manager', 'Client', 'Maintenance')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  async markAllAsRead(@CurrentUser() user: any) {
    await this.notificationsService.markAllAsRead(user.id_user);
    return { success: true };
  }
}
