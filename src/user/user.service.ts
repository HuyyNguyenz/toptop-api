import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dto'
import { hashPassword } from 'utils/crypto'
import { PrismaService } from 'src/prisma/prisma.service'
import { USER_MESSAGES } from 'constants/message'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashPassword(dto.password)
        },
        select: {
          id: true,
          email: true,
          first_name: true,
          last_name: true,
          created_at: true
        }
      })
      return {
        message: USER_MESSAGES.REGISTER_SUCCESS,
        user
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(USER_MESSAGES.EMAIL_EXIST)
      }
      throw error
    }
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email
      },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        password: true,
        created_at: true
      }
    })
    if (!user) {
      throw new NotFoundException(USER_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
    }
    if (user.password !== hashPassword(dto.password)) {
      throw new NotFoundException(USER_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
    }
    return {
      message: USER_MESSAGES.LOGIN_SUCCESS,
      user
    }
  }
}
