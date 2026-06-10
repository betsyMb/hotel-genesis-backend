import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Occupancy } from '../../occupancies/entities/occupancy.entity';

@Entity('walk_in_guests')
export class WalkInGuest {
  @PrimaryGeneratedColumn()
  id_walk_in_guest: number;

  @Column()
  id_occupancy: number;

  @ManyToOne(() => Occupancy, (occupancy) => occupancy.walk_in_guests)
  @JoinColumn({ name: 'id_occupancy' })
  occupancy: Occupancy;

  @Column({ length: 150 })
  full_name: string;

  @Column({ length: 20 })
  dni: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @CreateDateColumn()
  created_at: Date;
}
