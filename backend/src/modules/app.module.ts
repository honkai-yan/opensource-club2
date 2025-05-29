import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoginModule } from './login.module';
import { UserModule } from './user.module';

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
export class AppModule {}
