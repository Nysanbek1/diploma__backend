// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { User } from './auth/user.entity/user.entity';
import { UserData } from './user/user-data.entity';
import { Plan } from './plan/plan.entity/plan.entity'; // Путь к entity

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [User, UserData, Plan], // <--- добавляем все сущности
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    PlanModule,
  ],
})
export class AppModule {}
