import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { UserDetailDto } from 'src/dto/userDetail.dto';

export interface LoginResult {
  code: number | ExceptionEnum;
  message: string | ExceptionEnum;
  accessToken?: string;
  refreshToken?: string;
  userInfo: UserDetailDto | null;
}
