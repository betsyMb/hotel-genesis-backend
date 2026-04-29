import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
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

  @Column()
  check_in_date: Date;

  @Column()
  check_out_date: Date;

  @Column({ default: 1 })
  number_of_guests: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  reservation_status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reservation_date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
