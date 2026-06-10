import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Room } from '../../rooms/entities/room.entity';
import { WalkInGuest } from '../../walkin/entities/walk-in-guest.entity';

@Entity('occupancies')
export class Occupancy {
  @PrimaryGeneratedColumn()
  id_occupancy: number;

  @Column({ nullable: true })
  id_reservation: number | null;

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

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  total_amount_bs: number;

  @Column({ type: 'varchar', length: 10, default: 'nightly' })
  service_type: string;

  @OneToMany(() => WalkInGuest, (wg) => wg.occupancy)
  walk_in_guests?: WalkInGuest[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
