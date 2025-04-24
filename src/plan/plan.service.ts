import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './plan.entity/plan.entity';
import { User } from '../auth/user.entity/user.entity';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class PlanService {
  private openai: OpenAI;

  constructor(
    @InjectRepository(Plan)
    private planRepo: Repository<Plan>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY') ?? '',
    });
  }

  async generatePlan(userId: number, data: any): Promise<Plan> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('Пользователь не найден');

    const prompt = this.buildPrompt(data);

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = response.choices[0].message.content;
    if (!result) throw new Error('OpenAI не вернул ответ');

    const plan = this.planRepo.create({
      data: JSON.parse(result),
      user,
    });

    return this.planRepo.save(plan);
  }

  async getUserPlans(userId: number): Promise<Plan[]> {
    return this.planRepo.find({
      where: { user: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  private buildPrompt(data: any): string {
    return `
Пользователь указал:
- Пол: ${data.gender}
- Возраст: ${data.age}
- Вес: ${data.weight} кг
- Рост: ${data.height} см
- Процент жира: ${data.fatPercentage}%
- Уровень подготовки: ${data.physicalTraining}
- Цели: ${Object.keys(data.goal).filter((key) => data.goal[key]).join(', ')}
- Условия тренировок: ${Object.keys(data.trainingConditions).filter((key) => data.trainingConditions[key]).join(', ')}
- Ограничения: ${this.formatConditions(data)}
- Аллергии: ${Object.keys(data.allergy).filter((key) => data.allergy[key]).join(', ')}

Сформируй ответ в виде **валидного JSON-объекта**, строго без пояснений и текста вне JSON.

Формат:
{
  "1 день": {
    "Тренировка": [
      "Разминка: суставная гимнастика",
      "Приседания со штангой – 4x12",
      ...
    ],
    "Питание": {
      "Завтрак": "овсянка (100 г), яйцо (2 шт), банан (1 шт)",
      ...
    },
    "Комментарии": "После тренировки – белково-углеводный коктейль. Пейте воду в течение дня."
  },
  ...
  "7 день": { ... }
}

❗ Не пиши текст вне JSON. Ответ должен быть чистым JSON.
`;
  }

  private formatConditions(data: any): string {
    const all = {
      ...data.selected,
      ...data.knees,
      ...data.shoulders,
      ...data.elbowsHands,
      ...data.ankleFeet,
      ...data.vascularHearts,
      ...data.respiratory,
      ...data.endocrinology,
      ...data.neurologyPsychology,
    };

    return Object.keys(all).filter((key) => all[key]).join(', ');
  }
}
