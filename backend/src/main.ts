import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

async function bootstrap() {
  // 创建 nest 应用
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // 全局启用CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });
  // 全局API前缀
  app.setGlobalPrefix('api');
  // 启用cookie解析器
  app.use(cookieParser());
  // 启用日志
  app.useLogger(app.get(Logger));
  // 启用全局类型校验管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipNullProperties: true,
      skipUndefinedProperties: true,
    }),
  );

  // 开始监听
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
