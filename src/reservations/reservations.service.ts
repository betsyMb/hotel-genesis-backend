import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createReservationDto: CreateReservationDto): Promise<Reservation> {
    const reservation = this.reservationRepository.create(createReservationDto);
    return await this.reservationRepository.save(reservation);
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

  async update(id: number, updateReservationDto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);
    Object.assign(reservation, updateReservationDto);
    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);
    await this.reservationRepository.remove(reservation);
  }
}
