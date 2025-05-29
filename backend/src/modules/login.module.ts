import { Module } from '@nestjs/common';
import { LoginController } from 'src/controllers/login.controller';
import { LoginService } from 'src/services/login.service';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  providers: [LoginService],
  controllers: [LoginController],
})
export class LoginModule {}
