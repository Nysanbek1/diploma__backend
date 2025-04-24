// src/user/user-data.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity/user.entity';

@Entity()
export class UserData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column({ type: 'float', nullable: true })
  fatPercentage: number;

  @Column({ type: 'json' }) goal: any;
  @Column() physicalTraining: string;
  @Column({ type: 'json' }) trainingConditions: any;
  @Column({ type: 'json' }) selected: any;
  @Column({ type: 'json' }) knees: any;
  @Column({ type: 'json' }) shoulders: any;
  @Column({ type: 'json' }) elbowsHands: any;
  @Column({ type: 'json' }) ankleFeet: any;
  @Column({ type: 'json' }) vascularHearts: any;
  @Column({ type: 'json' }) respiratory: any;
  @Column({ type: 'json' }) endocrinology: any;
  @Column({ type: 'json' }) neurologyPsychology: any;
  @Column({ type: 'json' }) allergy: any;

  @ManyToOne(() => User, (user) => user.userData)
  user: User;
}
