import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './plan.entity/plan.entity';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { User } from '../auth/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, User])],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
