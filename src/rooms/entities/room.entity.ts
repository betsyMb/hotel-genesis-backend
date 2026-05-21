import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id_room: number;

  @Column({ unique: true, length: 10 })
  room_number: string;

  @Column({ type: 'varchar', length: 20 })
  room_type: string;

  @Column()
  floor: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price_per_night: number;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: 2 })
  capacity: number;

  @Column({ nullable: true })
  square_meters: number;

  @Column({ default: false })
  has_view: boolean;

  @Column({ default: false })
  has_balcony: boolean;

  @Column({ type: 'varchar', length: 20, default: 'available' })
  room_status: string;

  @Column({ nullable: true, type: 'text' })
  maintenance_notes: string;

  @Column({ nullable: true, type: 'jsonb' })
  maintenance_tasks: { id: string; description: string; completed: boolean }[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
