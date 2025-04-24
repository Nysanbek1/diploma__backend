import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../auth/user.entity/user.entity';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  data: Record<string, any>; // можно заменить на `any` при необходимости

  @ManyToOne(() => User, (user) => user.plans, {
    onDelete: 'CASCADE',
    eager: false, // отключает автоматическую подгрузку user (если не нужно)
  })
  user: User;
}
