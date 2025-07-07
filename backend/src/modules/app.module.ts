import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login.module';
import { UserModule } from './user.module';
import { AuthenticationMiddleware } from 'src/middleware/authentication.middleware';
import { UserController } from 'src/controllers/user.controller';
import { AuthorizationMiddleware } from 'src/middleware/authorization.middleware';

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
    consumer.apply(AuthenticationMiddleware).forRoutes(UserController);
    consumer.apply(AuthorizationMiddleware).forRoutes(
      {
        path: 'user/addUser',
        method: RequestMethod.POST,
      },
      {
        path: 'user/delUser',
        method: RequestMethod.POST,
      },
      {
        path: 'user/addUserBatch',
        method: RequestMethod.POST,
      },
    );
  }
}
