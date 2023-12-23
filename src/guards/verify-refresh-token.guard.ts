import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AUTH_MESSAGES } from 'src/constants/message'

@Injectable()
export class VerifyRefreshTokenGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const refresh_token = request.body.refresh_token as string
    if (!refresh_token) throw new UnauthorizedException(AUTH_MESSAGES.YOU_ARE_NOT_AUTHENTICATED)
    try {
      const refresh_token_verify = this.jwt.verify<{ user_id: string; exp: number }>(refresh_token, {
        secret: this.config.get('REFRESH_TOKEN_SECRET_KEY')
      })
      request.refresh_token_decoded = refresh_token_verify
      return true
    } catch (error) {
      throw new ForbiddenException(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED_OR_INVALID)
    }
  }
}
