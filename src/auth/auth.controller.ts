import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dtos'
import { VerifyEmailGuard } from './guards'
import { GetUser } from './decorators'
import { User } from '@prisma/client'
import { AuthService } from './auth.service'
import { VerifyRefreshTokenGuard } from './guards/verify-refresh-token.guard'
import { GetRefreshToken } from './decorators'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
  @HttpCode(HttpStatus.OK)
  @Patch('verify-email')
  @UseGuards(VerifyEmailGuard)
  verifyEmail(@GetUser() user: User) {
    return this.authService.verifyEmail(user)
  }
  @HttpCode(HttpStatus.OK)
  @Patch('refresh-token')
  @UseGuards(VerifyRefreshTokenGuard)
  refreshToken(
    @Body('refresh_token') refresh_token: string,
    @GetRefreshToken() refresh_token_decoded: { user_id: string; iat: number; exp: number }
  ) {
    return this.authService.refreshToken(refresh_token, refresh_token_decoded)
  }
}
