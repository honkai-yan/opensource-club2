import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { User } from './user.interface';

export interface LoginResult {
  code: number | ExceptionEnum;
  message: string | ExceptionEnum;
  accessToken?: string;
  refreshToken?: string;
  userInfo: User | null;
}
