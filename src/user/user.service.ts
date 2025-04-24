import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserData } from './user-data.entity';
import { User } from '../auth/user.entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserData)
    private userDataRepo: Repository<UserData>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  /**
   * Сохраняет или обновляет анкету пользователя.
   */
  async saveOrUpdateUserData(userId: number, data: any): Promise<UserData> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('Пользователь не найден');

    const existing = await this.userDataRepo.findOne({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });

    if (existing) {
      const updated = this.userDataRepo.merge(existing, data);
      return await this.userDataRepo.save(updated);
    }

    const userData: UserData = this.userDataRepo.create({
      gender: data.gender,
      age: data.age,
      weight: data.weight,
      height: data.height,
      fatPercentage: data.fatPercentage,
      goal: data.goal,
      physicalTraining: data.physicalTraining,
      trainingConditions: data.trainingConditions,
      selected: data.selected,
      knees: data.knees,
      shoulders: data.shoulders,
      elbowsHands: data.elbowsHands,
      ankleFeet: data.ankleFeet,
      vascularHearts: data.vascularHearts,
      respiratory: data.respiratory,
      endocrinology: data.endocrinology,
      neurologyPsychology: data.neurologyPsychology,
      allergy: data.allergy,
      user,
    });

    return await this.userDataRepo.save(userData);
  }

  /**
   * Возвращает последнюю анкету пользователя.
   */
  async getUserData(userId: number): Promise<UserData | null> {
    return await this.userDataRepo.findOne({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }
}
