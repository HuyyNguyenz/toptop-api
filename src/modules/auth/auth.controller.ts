import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto, RegisterDto } from 'src/dtos'
import { VerifyEmailGuard, VerifyRefreshTokenGuard } from 'src/guards'
import { GetRefreshToken, GetUser } from 'src/decorators'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
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
  verifyEmail(@GetUser('id') user_id: string, @GetUser('verified') verified: boolean) {
    return this.authService.verifyEmail(user_id, verified)
  }
  @HttpCode(HttpStatus.OK)
  @Patch('refresh-token')
  @UseGuards(VerifyRefreshTokenGuard)
  refreshToken(
    @Body('refresh_token') refresh_token: string,
    @GetRefreshToken() refresh_token_decoded: { user_id: string; exp: number }
  ) {
    return this.authService.refreshToken(refresh_token, refresh_token_decoded)
  }
  @Get('google/login')
  googleLogin() {
    return this.authService.googleLogin()
  }
  @Get('google/redirect')
  googleRedirect() {
    return this.authService.googleRedirect()
  }
}
