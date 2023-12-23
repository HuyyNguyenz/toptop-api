import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { UserModule } from './modules/user'
import { PrismaModule } from './modules/prisma'
import { AuthModule } from './modules/auth'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    JwtModule.register({
      global: true
    }),
    UserModule,
    PrismaModule,
    AuthModule
  ]
})
export class AppModule {}
