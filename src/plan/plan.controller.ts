import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { PlanService } from './plan.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  // Генерация нового плана
  @UseGuards(AuthGuard('jwt'))
  @Post('generate')
  async generate(@Req() req, @Body() body: any) {
    const userId = req.user.userId;
    const result = await this.planService.generatePlan(userId, body);
    return { message: 'План успешно сгенерирован', result };
  }

  // Получение истории всех планов пользователя
  @UseGuards(AuthGuard('jwt'))
  @Get('history')
  async getHistory(@Req() req) {
    const userId = req.user.userId;
    const plans = await this.planService.getUserPlans(userId);
    return { message: 'История планов', plans };
  }
}
