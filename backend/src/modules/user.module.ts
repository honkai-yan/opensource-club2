import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { DatabaseModule } from './database.module';
import { UserController } from 'src/controllers/user.controller';
import { UserDao } from 'src/dao/user.dao';

@Module({
  imports: [DatabaseModule],
  providers: [UserService, UserDao],
  controllers: [UserController],
  exports: [UserService, DatabaseModule, UserDao],
})
export class UserModule {}
