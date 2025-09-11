import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login.module';
import { UserModule } from './user.module';
import { AuthenticationMiddleware } from 'src/middleware/authentication.middleware';
import { UserController } from 'src/controllers/user.controller';
import { AuthorizationMiddleware } from 'src/middleware/authorization.middleware';
import { loggerConfig } from 'src/configs/pino';
import { GroupController } from 'src/controllers/group.controller';
import { GroupModule } from './group.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    LoginModule,
    UserModule,
    GroupModule,
    loggerConfig,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 认证
    consumer.apply(AuthenticationMiddleware).forRoutes(UserController);
    consumer.apply(AuthenticationMiddleware).forRoutes(GroupController);
    // 授权
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
      {
        path: 'user/delUserBatch',
        method: RequestMethod.POST,
      },
      {
        path: 'user/adminUpdateUser',
        method: RequestMethod.POST,
      },
    );
    consumer.apply(AuthorizationMiddleware).forRoutes(
      {
        path: 'group/updateInfoById',
        method: RequestMethod.POST,
      },
      {
        path: 'group/addUser',
        method: RequestMethod.POST,
      },
      {
        path: 'group/delUser',
        method: RequestMethod.POST,
      },
      {
        path: 'group/attachStudyDir',
        method: RequestMethod.POST,
      },
      {
        path: 'group/del',
        method: RequestMethod.POST,
      },
      {
        path: 'group/add',
        method: RequestMethod.POST,
      },
    );
  }
}
