import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { UserService } from 'src/services/user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/getAllDetails')
  async getUserDetails() {
    return await this.userService.getUserDetails();
  }

  @Post('/getDetailById')
  async getUserDetailById(@Body('id') id: number) {
    if (!id) {
      throw new HttpException(
        ExceptionEnum.RequestParamException,
        ExceptionEnum.RequestParamExceptionCode,
      );
    }
    return await this.userService.getUserDetailById(id);
  }
}
