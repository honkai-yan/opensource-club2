import { Injectable } from '@nestjs/common';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { LoginInfoDto } from 'src/dto/loginInfo.dto';
import { LoginResult } from 'src/interfaces/loginResult.interface';
import { User } from 'src/interfaces/user.interface';
import { signAccessToken, signRefreshToken, verifyToken } from 'src/utils/jwt';
import { UserService } from './user.service';
import { CaptchaPayload } from 'src/interfaces/captcha.interface';
import bcryptjs from 'bcryptjs';
import { UserDetailDto } from 'src/dto/userDetail.dto';

@Injectable()
export class LoginService {
  constructor(private readonly userService: UserService) {}

  async userLogin(
    loginInfoDto: LoginInfoDto,
    captchaInCookie: CaptchaPayload,
  ): Promise<LoginResult> {
    const { sch_id, pass, captcha } = loginInfoDto;

    if (captcha !== captchaInCookie.text) {
      return {
        code: ExceptionEnum.CaptchaErrorExceptionCode,
        message: ExceptionEnum.CaptchaErrorException,
        userInfo: null,
      };
    }

    // 验证用户名
    let user: User, userDetail: UserDetailDto;
    try {
      user = await this.userService.getUserBySchId(sch_id);
    } catch (e) {
      console.error(e);
      return {
        code: ExceptionEnum.InternalServerErrorExceptionCode,
        message: ExceptionEnum.InternalServerErrorException,
        userInfo: null,
      };
    }

    if (!user) {
      return {
        code: ExceptionEnum.UserNotFoundExceptionCode,
        message: ExceptionEnum.UserNotFoundException,
        userInfo: null,
      };
    }

    userDetail = await this.userService.getUserDetailById(user.id);

    // 验证密码
    if (!(await bcryptjs.compare(pass, user.password))) {
      return {
        code: ExceptionEnum.PasswordIncorrectExceptionCode,
        message: ExceptionEnum.PasswordIncorrectException,
        userInfo: null,
      };
    }

    // 登录成功，签发Token并返回数据
    const accessToken = await signAccessToken({
      id: user.id,
      name: user.name,
      type: 'accessToken',
    });
    const refreshToken = await signRefreshToken({
      id: user.id,
      type: 'refreshToken',
    });

    return {
      code: 200,
      message: '登录成功',
      accessToken,
      refreshToken,
      userInfo: userDetail,
    };
  }

  async autoLogin(userId: number): Promise<LoginResult> {
    try {
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return {
          code: ExceptionEnum.UserNotFoundExceptionCode,
          message: ExceptionEnum.UserNotFoundException,
          userInfo: null,
        };
      }

      const userDetail = await this.userService.getUserDetailById(user.id);

      const accessToken = await signAccessToken({
        id: user.id,
        name: user.name,
        type: 'accessToken',
      });
      const refreshToken = await signRefreshToken({
        id: user.id,
        type: 'refreshToken',
      });

      return {
        code: 200,
        message: '登录成功',
        accessToken,
        refreshToken,
        userInfo: userDetail,
      };
    } catch (err) {
      console.error(err);
      return {
        code: ExceptionEnum.InternalServerErrorExceptionCode,
        message: ExceptionEnum.InternalServerErrorException,
        userInfo: null,
      };
    }
  }
}
