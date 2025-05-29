import { User } from 'src/interfaces/user.interface';

export class LoginResponseDto {
  message: string;
  userinfo: User;

  constructor(message: string, userinfo: User) {
    this.message = message;
    this.userinfo = userinfo;
  }
}
