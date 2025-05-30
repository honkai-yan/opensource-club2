import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
