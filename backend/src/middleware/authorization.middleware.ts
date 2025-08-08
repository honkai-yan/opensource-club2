import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { AccessTokenPayload } from 'src/interfaces/accessTokenPayload.interface';
import { UserService } from 'src/services/user.service';
import { getTokenObj } from 'src/utils/token';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  private readonly roleList = ['会长', '副会长', '秘书处'];

  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tokenObj = await getTokenObj<AccessTokenPayload>(req, 'accessToken');
    if (!tokenObj) {
      throw new HttpException(
        ExceptionEnum.AccessTokenInvalidException,
        ExceptionEnum.AccessTokenInvalidExceptionCode,
      );
    }

    const { id } = tokenObj;
    const roleName = await this.userService.getUserRoleById(id);

    if (!this.roleList.includes(roleName)) {
      throw new HttpException(
        ExceptionEnum.NoPermissionException,
        ExceptionEnum.NoPermissionExceptionCode,
      );
    }

    return next();
  }
}
