import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as jwt from 'jsonwebtoken'
import { USER_MESSAGES } from 'constants/message'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class VerifyEmailGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = request.body.token as string
    try {
      const { user_id } = jwt.verify(token, this.config.get('VERIFY_EMAIL_TOKEN_SECRET_KEY')) as { user_id: string }
      const user = await this.prisma.user.findUnique({
        where: {
          id: user_id
        }
      })
      request.user = user
      return true
    } catch (error) {
      throw new ForbiddenException(USER_MESSAGES.VERIFY_EMAIL_TOKEN_EXPIRED)
    }
  }
}
