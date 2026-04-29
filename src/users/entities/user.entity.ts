import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id_user: number;

  @Column({ length: 100 })
  full_name: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column()
  password_hash: string;

  @Column()
  id_rol: number;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'id_rol' })
  role: Role;

  @Column({ default: true })
  is_active: boolean;

  @Column({ nullable: true })
  last_login: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
