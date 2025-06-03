import { Body, Controller, Get, HttpException, Post } from '@nestjs/common';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { UserService } from 'src/services/user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/getProfiles')
  async getProfiles() {
    return await this.userService.getProfiles();
  }

  @Post('/getProfileById')
  async getProfileById(@Body('id') id: number) {
    if (!id) {
      throw new HttpException(
        ExceptionEnum.RequestParamException,
        ExceptionEnum.RequestParamExceptionCode,
      );
    }

    const data = await this.userService.getProfileById(id);

    if (!data) {
      throw new HttpException(
        ExceptionEnum.UserNotFoundException,
        ExceptionEnum.UserNotFoundExceptionCode,
      );
    }

    return data;
  }
}
