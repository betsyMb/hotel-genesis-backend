import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id_notification: number;

  @Column()
  id_user: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: false })
  is_read: boolean;

  @Column({ nullable: true, type: 'integer' })
  id_reservation: number | null;

  @ManyToOne(() => Reservation, { nullable: true })
  @JoinColumn({ name: 'id_reservation' })
  reservation: Reservation;

  @CreateDateColumn()
  created_at: Date;
}
