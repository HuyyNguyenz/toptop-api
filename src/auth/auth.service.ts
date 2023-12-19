import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { LoginDto, RegisterDto } from './dtos'
import { hashPassword } from 'utils/crypto'
import { PrismaService } from 'src/prisma/prisma.service'
import { AUTH_MESSAGES } from 'constants/message'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import * as jwt from 'jsonwebtoken'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { sendVerifyEmail } from 'utils/send-email'

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService
  ) {}
  private signAccessToken(user_id: string) {
    return Promise.resolve(
      jwt.sign({ user_id }, this.config.get('ACCESS_TOKEN_SECRET_KEY'), {
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRE_TIME')
      })
    )
  }
  private signRefreshToken(user_id: string, exp?: number) {
    return Promise.resolve(
      exp
        ? jwt.sign({ user_id, exp }, this.config.get('REFRESH_TOKEN_SECRET_KEY'))
        : jwt.sign({ user_id }, this.config.get('REFRESH_TOKEN_SECRET_KEY'), {
            expiresIn: this.config.get('REFRESH_TOKEN_EXPIRE_TIME')
          })
    )
  }
  private signVerifyEmailToken(user_id: string) {
    return Promise.resolve(
      jwt.sign({ user_id }, this.config.get('VERIFY_EMAIL_TOKEN_SECRET_KEY'), {
        expiresIn: this.config.get('VERIFY_EMAIL_TOKEN_EXPIRE_TIME')
      })
    )
  }
  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hashPassword(dto.password)
        }
      })
      const verify_email_token = await this.signVerifyEmailToken(user.id)
      // console.log('verify_email_token:', verify_email_token)
      await sendVerifyEmail(
        user.email,
        'Verify Email',
        `${process.env.CLIENT_URL}/verify-email?token=${verify_email_token}`
      )
      return {
        message: AUTH_MESSAGES.REGISTER_SUCCESS
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new BadRequestException(AUTH_MESSAGES.EMAIL_EXIST)
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
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
    }
    if (user.password !== hashPassword(dto.password)) {
      throw new NotFoundException(AUTH_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT)
    }
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user.id),
      this.signRefreshToken(user.id)
    ])
    await this.prisma.token.create({
      data: {
        token: refresh_token,
        user_id: user.id
      }
    })
    return {
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      result: {
        access_token,
        refresh_token
      }
    }
  }
  async verifyEmail(user: User) {
    if (!user.verified) {
      await this.prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          verified: true
        }
      })
      return {
        message: AUTH_MESSAGES.VERIFY_EMAIL_SUCCESS
      }
    }
    return {
      message: AUTH_MESSAGES.EMAIL_ALREADY_VERIFIED
    }
  }
  async refreshToken(refresh_token: string, refresh_token_decoded: { user_id: string; iat: number; exp: number }) {
    const token = await this.prisma.token.findUnique({
      where: {
        token: refresh_token
      },
      select: {
        user_id: true
      }
    })
    if (!token) {
      throw new NotFoundException(AUTH_MESSAGES.REFRESH_TOKEN_NOT_FOUND)
    }
    const { user_id, exp } = refresh_token_decoded
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id, exp)
    ])
    await this.prisma.token.update({
      where: {
        token: refresh_token
      },
      data: {
        token: new_refresh_token
      }
    })
    return {
      message: AUTH_MESSAGES.REFRESH_TOKEN_SUCCESS,
      result: {
        access_token: new_access_token,
        refresh_token: new_refresh_token
      }
    }
  }
}
