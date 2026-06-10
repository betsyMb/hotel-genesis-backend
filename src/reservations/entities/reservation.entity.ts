import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Type } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id_reservation: number;

  @Column()
  id_client: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_client' })
  client: User;

  @Column()
  id_room: number;

  @ManyToOne(() => Room)
  @JoinColumn({ name: 'id_room' })
  room: Room;

  @Column({ type: 'date' })
  check_in_date: string;

  @Column({ type: 'date' })
  check_out_date: string;

  @Column({ default: 1 })
  number_of_guests: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  reservation_status: string;

  @CreateDateColumn()
  reservation_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  total_amount_bs: number;

  @Column({ type: 'varchar', length: 10, default: 'nightly' })
  service_type: string;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
