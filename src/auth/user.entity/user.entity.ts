import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserData } from '../../user/user-data.entity';
import { Plan } from '../../plan/plan.entity/plan.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => UserData, (userData) => userData.user, { cascade: true })
  userData: UserData[];

  @OneToMany(() => Plan, (plan) => plan.user, { cascade: true })
  plans: Plan[];
}
