import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { AccessTokenPayload } from 'src/interfaces/accessTokenPayload.interface';
import { UserService } from 'src/services/user.service';
import { getTokenObj } from 'src/utils/token';

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    if (req.url === '/api/auth/checkLoginToken') {
      next();
      return;
    }

    const tokenObj = await getTokenObj<AccessTokenPayload>(req, 'accessToken');
    if (!tokenObj) {
      throw new HttpException(
        ExceptionEnum.AccessTokenInvalidException,
        ExceptionEnum.AccessTokenInvalidExceptionCode,
      );
    }

    const { id } = tokenObj;
    if (!(await this.userService.getUserById(id))) {
      throw new HttpException(
        ExceptionEnum.InvalidUserException,
        ExceptionEnum.InvalidUserExceptionCode,
      );
    }

    return next();
  }
}
