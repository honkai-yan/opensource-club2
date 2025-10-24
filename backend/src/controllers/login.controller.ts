import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginInfoDto } from 'src/dto/login/loginInfo.dto';
import { LoginService } from 'src/services/login.service';
import svgCaptcha from 'svg-captcha';
import { Request, Response } from 'express';
import { setCookie } from 'src/utils/cookie';
import { createToken, verifyToken } from 'src/utils/jwt';
import { CaptchaPayload } from 'src/interfaces/captcha.interface';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { LoginResponseDto } from 'src/dto/login/loginResponse.dto';
import { RefreshTokenPayload } from 'src/interfaces/refreshTokenPayload.interface';
import { isEmpty } from 'lodash';
import { getTokenObj } from 'src/utils/token';
import { Logger } from 'nestjs-pino';
import { ResponseResultDto } from 'src/dto/responseResult.dto';

@Controller('auth')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly logger: Logger,
  ) {}

  @Get('getCaptcha')
  async getCaptcha(@Res() res: Response) {
    let { data, text } = svgCaptcha.create();
    text = text.toLowerCase();
    this.logger.debug(text);
    const payload: CaptchaPayload = {
      text: text,
    };
    const captchaToken = await createToken(payload, '5m');
    setCookie(res, 'captcha', captchaToken, 60 * 5 * 1000);
    return res.send(data);
  }

  @Get('checkLoginToken')
  async checkLoginToken(@Req() req: Request) {
    const refreshToken = await getTokenObj<RefreshTokenPayload>(
      req,
      'refreshToken',
    );
    if (!refreshToken)
      throw new HttpException(
        ExceptionEnum.RefreshTokenErrorException,
        ExceptionEnum.RefreshTokenErrorExceptionCode,
      );
    return new ResponseResultDto(200, '令牌校验成功');
  }

  @Post('login')
  async login(
    @Body() loginInfoDto: LoginInfoDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const captcha = await getTokenObj<CaptchaPayload>(req, 'captcha');

    if (!captcha) {
      throw new HttpException(
        ExceptionEnum.CaptchaErrorException,
        ExceptionEnum.CaptchaErrorExceptionCode,
      );
    }

    // 发起登录
    const loginResult = await this.loginService.userLogin(
      loginInfoDto,
      captcha,
    );

    // 登录失败
    if (loginResult.code !== 200) {
      throw new HttpException(
        loginResult.message as string,
        loginResult.code as number,
      );
    }

    // 登录成功，删除 Captcha Cookie，设置令牌 Token 并返回成功信息
    res.clearCookie('captcha');

    setCookie(res, 'accessToken', loginResult.accessToken, 3600 * 1000);
    setCookie(
      res,
      'refreshToken',
      loginResult.refreshToken,
      3600 * 24 * 7 * 1000,
    );

    return res.json(
      new ResponseResultDto(200, '登录成功', {
        ...loginResult.userInfo,
        password: undefined,
      }),
    );
  }

  @Post('autoLogin')
  async autoLogin(@Req() req: Request, @Res() res: Response) {
    // 校验刷新令牌
    const cookie = req.cookies.refreshToken;
    if (!cookie) {
      throw new HttpException(
        ExceptionEnum.RefreshTokenInvalidException,
        ExceptionEnum.RefreshTokenInvalidExceptionCode,
      );
    }

    const refreshToken: RefreshTokenPayload = (await verifyToken(
      req.cookies.refreshToken,
    )) as any;

    if (!refreshToken) {
      throw new HttpException(
        ExceptionEnum.RefreshTokenInvalidException,
        ExceptionEnum.RefreshTokenInvalidExceptionCode,
      );
    }

    const { id } = refreshToken;
    const loginResult = await this.loginService.autoLogin(id);

    if (loginResult.code !== 200) {
      throw new HttpException(
        loginResult.message as string,
        loginResult.code as number,
      );
    }

    setCookie(res, 'accessToken', loginResult.accessToken, 3600 * 1000);
    setCookie(
      res,
      'refreshToken',
      loginResult.refreshToken,
      3600 * 24 * 7 * 1000,
    );

    return res.json(
      new ResponseResultDto(200, '登录成功', {
        ...loginResult.userInfo,
        password: undefined,
      }),
    );
  }
}
