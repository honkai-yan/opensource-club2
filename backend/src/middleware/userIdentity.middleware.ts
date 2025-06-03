import { HttpException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { AccessTokenPayload } from 'src/interfaces/accessTokenPayload.interface';
import { verifyToken } from 'src/utils/jwt';

export class UserIdentityMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies.accessToken as string;
    const verifiedToken: AccessTokenPayload = (await verifyToken(
      accessToken,
    )) as any;

    if (!verifiedToken) {
      throw new HttpException(
        ExceptionEnum.AccessTokenInvalidException,
        ExceptionEnum.AccessTokenInvalidExceptionCode,
      );
    }

    return next();
  }
}
