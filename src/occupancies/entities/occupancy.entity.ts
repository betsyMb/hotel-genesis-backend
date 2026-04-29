import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('occupancies')
export class Occupancy {
  @PrimaryGeneratedColumn()
  id_occupancy: number;

  @Column()
  id_reservation: number;

  @ManyToOne(() => Reservation)
  @JoinColumn({ name: 'id_reservation' })
  reservation: Reservation;

  @Column()
  id_room: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'id_room' })
  room: Room;

  @Column()
  actual_check_in: Date;

  @Column({ nullable: true })
  actual_check_out: Date;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  occupancy_status: string;

  @Column({ nullable: true, type: 'text' })
  guest_signature: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
