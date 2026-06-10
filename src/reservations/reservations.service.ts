import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async checkOverlap(
    id_room: number,
    checkIn: string,
    checkOut: string,
    excludeId?: number,
  ): Promise<{ confirmed: Reservation[]; pending: Reservation[] }> {
    const orConditions: any[] = [
      { id_room, reservation_status: 'pending' },
      { id_room, reservation_status: 'confirmed' },
    ];

    let query = this.reservationRepository
      .createQueryBuilder('r')
      .where('r.id_room = :id_room', { id_room })
      .andWhere('r.reservation_status IN (:...statuses)', { statuses: ['pending', 'confirmed'] })
      .andWhere('r.check_in_date < :checkOut AND r.check_out_date > :checkIn', {
        checkIn,
        checkOut,
      });

    if (excludeId !== undefined) {
      query = query.andWhere('r.id_reservation != :excludeId', { excludeId });
    }

    const overlapping = await query.getMany();

    return {
      confirmed: overlapping.filter((r) => r.reservation_status === 'confirmed'),
      pending: overlapping.filter((r) => r.reservation_status === 'pending'),
    };
  }

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const checkIn = this.toDateOnly(createReservationDto.check_in_date);
    const checkOut = this.toDateOnly(createReservationDto.check_out_date);

    if (checkOut <= checkIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    const { confirmed, pending } = await this.checkOverlap(
      createReservationDto.id_room,
      checkIn,
      checkOut,
    );

    if (confirmed.length > 0) {
      throw new BadRequestException(
        'La habitación ya tiene una reserva CONFIRMADA para estas fechas. Seleccione otra habitación o fechas.',
      );
    }

    if (pending.length > 0) {
      throw new BadRequestException(
        'Ya existe una reserva PENDIENTE para estas fechas en esta habitación. Por favor comuníquese con el hotel al 2-222222 para coordinar o elija otra fecha.',
      );
    }

    const reservation = this.reservationRepository.create({
      ...createReservationDto,
      check_in_date: checkIn,
      check_out_date: checkOut,
    });

    return await this.reservationRepository.save(reservation);
  }

  private toDateOnly(value: string | Date): string {
    if (typeof value === 'string') {
      return value.split('T')[0];
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async findAll(): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      relations: ['client', 'room'],
    });
  }

  async findByClient(clientId: number): Promise<Reservation[]> {
    return await this.reservationRepository.find({
      where: { id_client: clientId },
      relations: ['client', 'room'],
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id_reservation: id },
      relations: ['client', 'room'],
    });
    if (!reservation) throw new NotFoundException(`Reservation with ID ${id} not found`);
    return reservation;
  }

  async findByClientAndId(id: number, clientId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id_reservation: id, id_client: clientId },
      relations: ['client', 'room'],
    });
    if (!reservation) throw new NotFoundException(`Reservation not found`);
    return reservation;
  }

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    const data = { ...updateReservationDto };
    if (data.check_in_date) data.check_in_date = this.toDateOnly(data.check_in_date) as any;
    if (data.check_out_date) data.check_out_date = this.toDateOnly(data.check_out_date) as any;

    const effectiveIn = (data.check_in_date as string) || reservation.check_in_date;
    const effectiveOut = (data.check_out_date as string) || reservation.check_out_date;
    const effectiveRoom = data.id_room ?? reservation.id_room;

    if (effectiveOut <= effectiveIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    if (data.check_in_date || data.check_out_date || data.id_room !== undefined) {
      const { confirmed, pending } = await this.checkOverlap(
        effectiveRoom,
        effectiveIn,
        effectiveOut,
        id,
      );
      if (confirmed.length > 0) {
        throw new BadRequestException(
          'La habitación ya tiene una reserva CONFIRMADA para estas fechas.',
        );
      }
      if (pending.length > 0) {
        throw new BadRequestException(
          'Ya existe una reserva PENDIENTE para estas fechas en esta habitación. Por favor comuníquese con el hotel para coordinar o elija otra fecha.',
        );
      }
    }

    Object.assign(reservation, data);
    return await this.reservationRepository.save(reservation);
  }

  async updateByClient(id: number, updateReservationDto: UpdateReservationDto, clientId: number): Promise<Reservation> {
    const reservation = await this.findByClientAndId(id, clientId);
    const data = { ...updateReservationDto };
    if (data.check_in_date) data.check_in_date = this.toDateOnly(data.check_in_date) as any;
    if (data.check_out_date) data.check_out_date = this.toDateOnly(data.check_out_date) as any;

    const effectiveIn = (data.check_in_date as string) || reservation.check_in_date;
    const effectiveOut = (data.check_out_date as string) || reservation.check_out_date;
    const effectiveRoom = data.id_room ?? reservation.id_room;

    if (effectiveOut <= effectiveIn) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    if (data.check_in_date || data.check_out_date || data.id_room !== undefined) {
      const { confirmed, pending } = await this.checkOverlap(
        effectiveRoom,
        effectiveIn,
        effectiveOut,
        id,
      );
      if (confirmed.length > 0) {
        throw new BadRequestException(
          'La habitación ya tiene una reserva CONFIRMADA para estas fechas.',
        );
      }
      if (pending.length > 0) {
        throw new BadRequestException(
          'Ya existe una reserva PENDIENTE para estas fechas en esta habitación. Por favor comuníquese con el hotel para coordinar o elija otra fecha.',
        );
      }
    }

    Object.assign(reservation, data);
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }

  async removeByClient(id: number, clientId: number): Promise<void> {
    const reservation = await this.findByClientAndId(id, clientId);
    await this.reservationRepository.remove(reservation);
  }
}
