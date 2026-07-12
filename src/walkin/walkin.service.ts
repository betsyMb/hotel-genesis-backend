import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
import { OccupanciesService } from '../occupancies/occupancies.service';
import { ReservationsService } from '../reservations/reservations.service';
import { WalkInGuest } from './entities/walk-in-guest.entity';
import { CheckInDto } from './dto/checkin.dto';
import { CheckOutDto } from './dto/checkout.dto';
import { Room } from '../rooms/entities/room.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class WalkinService {
  constructor(
    @InjectRepository(WalkInGuest)
    private readonly walkInGuestRepository: Repository<WalkInGuest>,
    private readonly roomsService: RoomsService,
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly occupanciesService: OccupanciesService,
    private readonly reservationsService: ReservationsService,
  ) {}

  async checkin(dto: CheckInDto) {
    const room = await this.roomsService.findOne(dto.room_id);
    if (!room) throw new NotFoundException(`Room ${dto.room_id} not found`);
    if (room.room_status !== 'available') {
      throw new ConflictException(
        `Room ${room.room_number} is not available (status: ${room.room_status})`,
      );
    }

    let user = await this.usersService
      .findByDni(dto.guest.dni)
      .catch(() => null);

    if (!user) {
      const clientRole = await this.rolesService.findByName('Client');
      const email = `walkin-${dto.guest.dni}@hotel.app`;
      user = await this.usersService.create({
        full_name: `${dto.guest.first_name} ${dto.guest.last_name}`,
        email,
        phone: dto.guest.phone_number || '',
        password_hash: dto.guest.dni,
        id_rol: clientRole.id_rol,
        dni: dto.guest.dni,
        is_active: true,
      } as any);
    }

    const now = new Date();
    const checkOutEstimate = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const occupancy = await this.occupanciesService.create({
      id_reservation: null,
      id_room: room.id_room,
      actual_check_in: now,
      occupancy_status: 'active',
      guest_signature: `${dto.guest.first_name} ${dto.guest.last_name}`,
      service_type: dto.service_type || 'nightly',
    } as any);

    const allGuests = [dto.guest, ...(dto.additional_guests || [])];
    const walkInGuests = this.walkInGuestRepository.create(
      allGuests.map((g) => ({
        id_occupancy: occupancy.id_occupancy,
        full_name: `${g.first_name} ${g.last_name}`,
        dni: g.dni,
        phone: g.phone_number || '',
      })),
    );
    await this.walkInGuestRepository.save(walkInGuests);

    await this.roomsService.update(room.id_room, {
      room_status: 'occupied',
    } as any);

    return {
      message: 'Check-in successful',
      occupancy_id: occupancy.id_occupancy,
      room_id: room.id_room,
      room_number: room.room_number,
      user_id: user.id_user,
      user_created: !user.dni || user.email.startsWith('walkin-'),
      guest_count: allGuests.length,
    };
  }

  async getHistory() {
    const occupancies = await this.occupanciesService.findCompletedWalkIns();

    const occupancyIds = occupancies.map((o) => o.id_occupancy);
    const allGuests =
      occupancyIds.length > 0
        ? await this.walkInGuestRepository.find({
            where: { id_occupancy: In(occupancyIds) },
          })
        : [];
    const guestsByOccupancy = new Map(
      occupancyIds.map((id) => [
        id,
        allGuests.filter((g) => g.id_occupancy === id),
      ]),
    );

    return occupancies.map((o) => {
      const checkIn = new Date(o.actual_check_in);
      const checkOut = o.actual_check_out
        ? new Date(o.actual_check_out)
        : new Date();
      const totalNights = Math.max(
        1,
        Math.ceil(
          (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      return {
        id_occupancy: o.id_occupancy,
        room_id: o.id_room,
        room_number: o.room?.room_number || null,
        room_type: o.room?.room_type || null,
        guest_signature: o.guest_signature,
        guests: (guestsByOccupancy.get(o.id_occupancy) || []).map((g) => ({
          full_name: g.full_name,
          dni: g.dni,
          phone: g.phone,
        })),
        total_nights: totalNights,
        service_type: o.service_type || 'nightly',
        checked_in: o.actual_check_in,
        checked_out: o.actual_check_out,
      };
    });
  }

  async checkout(dto: CheckOutDto) {
    const room = await this.roomsService.findOne(dto.room_id);
    if (!room) throw new NotFoundException(`Room ${dto.room_id} not found`);

    const activeOccupancies = await this.occupanciesService.findByRoomAndStatus(
      room.id_room,
      'active',
    );

    if (activeOccupancies.length === 0) {
      throw new NotFoundException(
        `No active occupancy found for Room ${room.room_number}`,
      );
    }

    const occupancy = activeOccupancies[0];
    const serviceType = occupancy.service_type || 'nightly';
    const now = new Date();
    const checkIn = new Date(occupancy.actual_check_in);
    const totalNights = Math.max(
      1,
      Math.ceil((now.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)),
    );

    const updateData: any = {
      actual_check_out: now,
      occupancy_status: 'completed',
    };
    if (dto.total_amount !== undefined)
      updateData.total_amount = dto.total_amount;
    if (dto.total_amount_bs !== undefined)
      updateData.total_amount_bs = dto.total_amount_bs;

    await this.occupanciesService.update(occupancy.id_occupancy, updateData);

    await this.roomsService.update(room.id_room, {
      room_status: 'available',
    } as any);

    if (occupancy.id_reservation) {
      await this.reservationsService.update(occupancy.id_reservation, {
        reservation_status: 'completed',
      } as any);
    }

    return {
      message: 'Check-out successful',
      room_id: room.id_room,
      room_number: room.room_number,
      occupancy_id: occupancy.id_occupancy,
      total_nights: totalNights,
      service_type: serviceType,
      checked_in: occupancy.actual_check_in,
      checked_out: now,
    };
  }
}
