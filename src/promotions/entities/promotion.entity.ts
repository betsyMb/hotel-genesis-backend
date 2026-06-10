import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn()
  id_promotion: number;

  @Column({ unique: true, length: 50 })
  promotion_code: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discount_percent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discount_amount: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column({ default: 1 })
  min_nights: number;

  @Column({ nullable: true })
  max_usage: number;

  @Column({ default: 0 })
  times_used: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
