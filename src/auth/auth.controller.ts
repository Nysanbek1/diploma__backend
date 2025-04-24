import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { login: string; email: string; password: string; passwordTwe: string },
  ) {
    if (body.password !== body.passwordTwe) {
      throw new Error('Пароли не совпадают');
    }

    return this.authService.register(body.login, body.email, body.password);
  }

  @Post('login')
  async login(@Body() body: { login: string; password: string }) {
    const user = await this.authService.validateUser(body.login, body.password);
    if (!user) throw new UnauthorizedException('Неверный логин или пароль');

    return this.authService.login(user);
  }
}
