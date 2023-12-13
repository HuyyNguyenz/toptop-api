import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { LoginDto, RegisterDto } from './dto'
import { VerifyEmailGuard } from './guard'
import { GetUser } from './decorator'
import { User } from '@prisma/client'

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.userService.register(dto)
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.userService.login(dto)
  }
  @HttpCode(HttpStatus.OK)
  @Patch('verify-email')
  @UseGuards(VerifyEmailGuard)
  verifyEmail(@GetUser() user: User) {
    return this.userService.verifyEmail(user)
  }
}
