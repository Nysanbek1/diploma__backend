import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity/user.entity';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Регистрация нового пользователя
   */
  async register(login: string, email: string, password: string) {
    // Хеширование пароля
    const hashed = await bcrypt.hash(password, 10);

    // Создание и сохранение пользователя
    const user = this.userRepo.create({ login, email, password: hashed });
    return this.userRepo.save(user);
  }

  /**
   * Проверка логина и пароля
   */
  async validateUser(login: string, password: string) {
    const user = await this.userRepo.findOne({ where: { login } });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }

  /**
   * Генерация JWT токена после успешного входа
   */
  async login(user: User) {
    const payload = { sub: user.id, login: user.login };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
      },
    };
  }
}
