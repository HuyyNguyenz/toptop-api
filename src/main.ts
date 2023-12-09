import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: process.env.CLIENT_URL
  })
  await app.listen(process.env.PORT || 8000)
  console.log(`Application is running on http://localhost:${process.env.PORT}`)
}
bootstrap()