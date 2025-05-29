import { Module } from '@nestjs/common';
import { UserService } from 'src/services/user.service';
import { DatabaseModule } from './database.module';

@Module({
  imports: [DatabaseModule],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
