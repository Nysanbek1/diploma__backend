import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Сохраняет или обновляет анкету пользователя.
   */
  @UseGuards(AuthGuard('jwt'))
  @Post('submit')
  async submit(@Req() req, @Body() body: any) {
    const userId = req.user.userId;
    const result = await this.userService.saveOrUpdateUserData(userId, body);
    return { message: 'Анкета сохранена или обновлена', result };
  }

  /**
   * Возвращает последнюю анкету текущего пользователя.
   */
  @UseGuards(AuthGuard('jwt'))
  @Get('data')
  async getData(@Req() req) {
    const userId = req.user.userId;
    const result = await this.userService.getUserData(userId);
    return result;
  }
}
