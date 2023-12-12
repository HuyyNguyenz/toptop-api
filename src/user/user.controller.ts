import { Body, Controller, HttpCode, HttpStatus, Patch, Post } from '@nestjs/common'
import { UserService } from './user.service'
import { LoginDto, RegisterDto } from './dto'

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
  verifyEmail(@Body('token') token: string) {
    return this.userService.verifyEmail(token)
  }
}
