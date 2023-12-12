import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dto'
import { hashPassword } from 'utils/crypto'
import { PrismaService } from 'src/prisma/prisma.service'
import { USER_MESSAGES } from 'constants/message'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as jwt from 'jsonwebtoken'
// import { sendVerifyEmail } from 'utils/send-email'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  private signAccessToken(user_id: string) {
    return jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
    })
  }
  private signRefreshToken(user_id: string) {
    return jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET_KEY, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME
    })
  }
  private signVerifyEmailToken(user_id: string) {
    return jwt.sign({ user_id }, process.env.VERIFY_EMAIL_TOKEN_SECRET_KEY, {
      expiresIn: process.env.VERIFY_EMAIL_TOKEN_EXPIRE_TIME
    })
  }
  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.users.create({
        data: {
          ...dto,
          password: hashPassword(dto.password)
        }
      })
      const verify_email_token = this.signVerifyEmailToken(user.id)
      console.log('verify_email_token:', verify_email_token)

      // await sendVerifyEmail(
      //   user.email,
      //   'Verify Email',
      //   `${process.env.CLIENT_URL}/verify-email?token=${verify_email_token}`
      // )
      return {
        message: USER_MESSAGES.REGISTER_SUCCESS
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(USER_MESSAGES.EMAIL_EXIST)
      }
      throw error
    }
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
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
  async verifyEmail(token: string) {
    try {
      const { user_id } = jwt.verify(token, process.env.VERIFY_EMAIL_TOKEN_SECRET_KEY) as {
        user_id: string
      }
      await this.prisma.users.update({
        where: {
          id: user_id
        },
        data: {
          verified: true
        }
      })
      return {
        message: USER_MESSAGES.VERIFY_EMAIL_SUCCESS
      }
    } catch (error) {
      throw new BadRequestException(USER_MESSAGES.VERIFY_EMAIL_TOKEN_EXPIRED)
    }
  }
}
