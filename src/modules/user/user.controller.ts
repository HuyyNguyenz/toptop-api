import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '@prisma/client'
import { UserGuard } from 'src/guards'
import { GetUser } from 'src/decorators'

@Controller('users')
@UseGuards(UserGuard)
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.OK)
  @Get('me')
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user)
  }
}
