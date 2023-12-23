import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { USER_MESSAGES } from 'src/constants/message'

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService
  ) {}
  async getMe(user: User) {
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.USER_NOT_FOUND)
    }
    return user
  }
}
