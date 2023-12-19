import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { USER_MESSAGES } from 'constants/message'

@Injectable()
export class UserService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {}
  async getMe(user: User) {
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND)
    }
    return user
  }
}
