import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Expo } from 'expo-server-sdk';
import { Notification } from './entities/notification.entity';
import { UsersService } from '../users/users.service';
import { ReservationsService } from '../reservations/reservations.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly usersService: UsersService,
    private readonly reservationsService: ReservationsService,
  ) {}

  async create(
    userId: number,
    title: string,
    message: string,
    reservationId?: number,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      id_user: userId,
      title,
      message,
      ...(reservationId ? { id_reservation: reservationId } : {}),
    });
    return await this.notificationRepository.save(notification);
  }

  async findByUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { id_user: userId },
      order: { created_at: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<void> {
    await this.notificationRepository.update(id, { is_read: true });
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { id_user: userId, is_read: false },
      { is_read: true },
    );
  }

  async getUnreadCount(userId: number): Promise<number> {
    return await this.notificationRepository.count({
      where: { id_user: userId, is_read: false },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async sendUpcomingReservationReminders() {
    this.logger.log('Checking for upcoming reservations...');

    const today = new Date();
    const target = new Date(today);
    target.setDate(target.getDate() + 2);

    const targetStr = target.toISOString().split('T')[0];

    const reservations = await this.reservationsService.findAll();
    const upcoming = reservations.filter((r) => {
      const checkIn = r.check_in_date.split('T')[0];
      return (
        checkIn === targetStr &&
        (r.reservation_status === 'confirmed' ||
          r.reservation_status === 'pending')
      );
    });

    if (upcoming.length === 0) {
      this.logger.log('No upcoming reservations found for +2 days');
      return;
    }

    const users = await this.usersService.findAll();
    const recipients = users.filter(
      (u) =>
        u.role?.role_name === 'Administrator' ||
        u.role?.role_name === 'Receptionist',
    );

    if (recipients.length === 0) {
      this.logger.warn('No admin or receptionist users found to notify');
      return;
    }

    const expo = new Expo();
    const pushTokens: string[] = [];
    let createdCount = 0;

    for (const reservation of upcoming) {
      const roomNumber =
        reservation.room?.room_number || `#${reservation.id_room}`;
      const clientName =
        reservation.client?.full_name || `Cliente #${reservation.id_client}`;
      const statusLabel =
        reservation.reservation_status === 'confirmed'
          ? 'Confirmada'
          : 'Pendiente';

      for (const recipient of recipients) {
        const existing = await this.notificationRepository.findOne({
          where: {
            id_user: recipient.id_user,
            id_reservation: reservation.id_reservation,
            title: `Reserva próxima: Hab. ${roomNumber}`,
          },
        });
        if (existing) continue;

        await this.create(
          recipient.id_user,
          `Reserva próxima: Hab. ${roomNumber}`,
          `La reserva de ${clientName} en Hab. ${roomNumber} (${statusLabel}) es en 2 días. Fecha de entrada: ${reservation.check_in_date}`,
          reservation.id_reservation,
        );
        createdCount++;

        if (
          recipient.push_token &&
          Expo.isExpoPushToken(recipient.push_token)
        ) {
          pushTokens.push(recipient.push_token);
        }
      }
    }

    if (pushTokens.length > 0) {
      const pushMessages = pushTokens.map((token) => ({
        to: token,
        sound: 'default' as const,
        title: 'Reserva próxima',
        body: `Una reserva está por comenzar en 2 días. Revise las notificaciones para más detalles.`,
        data: {},
      }));
      const chunks = expo.chunkPushNotifications(pushMessages as any);
      for (const chunk of chunks) {
        try {
          await expo.sendPushNotificationsAsync(chunk as any);
        } catch (error) {
          this.logger.error('Error sending push notifications', error);
        }
      }
    }

    this.logger.log(
      `Created ${createdCount} upcoming reservation notifications`,
    );
  }
}
