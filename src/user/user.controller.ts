import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UserGuard } from './guards'
import { GetUser } from './decorators'
import { User } from '@prisma/client'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Get('me')
  @UseGuards(UserGuard)
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user)
  }
}
