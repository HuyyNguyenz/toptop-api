import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AUTH_MESSAGES } from 'src/constants/message'
import { PrismaService } from 'src/modules/prisma/prisma.service'

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1] as string
    if (!token) throw new UnauthorizedException(AUTH_MESSAGES.YOU_ARE_NOT_AUTHENTICATED)
    try {
      const { user_id } = this.jwt.verify<{ user_id: string }>(token, {
        secret: this.config.get('ACCESS_TOKEN_SECRET_KEY')
      })
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id
        },
        select: {
          id: true,
          email: true,
          username: true,
          first_name: true,
          last_name: true,
          avatar: true,
          bio: true
        }
      })
      request.user = user
      return true
    } catch (error) {
      throw new ForbiddenException(AUTH_MESSAGES.ACCESS_TOKEN_EXPIRED_OR_INVALID)
    }
  }
}
