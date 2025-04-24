import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserData } from './user-data.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../auth/user.entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserData, User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
