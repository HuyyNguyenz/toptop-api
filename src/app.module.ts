import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    UserModule,
    PrismaModule
  ]
})
export class AppModule {}
