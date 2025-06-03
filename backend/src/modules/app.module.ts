import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login.module';
import { UserModule } from './user.module';
import { UserIdentityMiddleware } from 'src/middleware/userIdentity.middleware';
import { UserController } from 'src/controllers/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    LoginModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserIdentityMiddleware).forRoutes(UserController);
  }
}
