import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { AddUserDto } from 'src/dto/addUser.dto';
import { DelUserDto } from 'src/dto/delUser.dto';
import { OperationResponseDto } from 'src/dto/operationResponse.dto';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { AccessTokenPayload } from 'src/interfaces/accessTokenPayload.interface';
import { UserService } from 'src/services/user.service';
import { verifyToken } from 'src/utils/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getProfiles')
  async getProfiles() {
    return await this.userService.getProfiles();
  }

  @Post('getProfileById')
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

  @Post('updateProfile')
  async updateProfile(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @Req() req: Request,
  ) {
    const accessTokenCookie = req.cookies.accessToken;
    const accessToken: AccessTokenPayload = (await verifyToken(
      accessTokenCookie,
    )) as any;

    const id = accessToken.id;
    const result = await this.userService.updateProfileById(
      id,
      updateUserProfileDto,
    );

    if (result.code !== 200) {
      throw new HttpException(result.message, result.code);
    }

    return new OperationResponseDto(result.code, result.message);
  }

  @Post('addUser')
  async addUser(@Body() addUserDto: AddUserDto) {
    const operationResponse = await this.userService.addUser(addUserDto);
    if (operationResponse.code !== 200) {
      throw new HttpException(
        operationResponse.message,
        operationResponse.code,
      );
    }
    return new OperationResponseDto(
      operationResponse.code,
      operationResponse.message,
    );
  }

  @Post('delUser')
  async delUser(@Body() delUser: DelUserDto) {
    const result = await this.userService.delUserById(delUser.id);
    if (result.code !== 200) {
      throw new HttpException(result.message, result.code);
    }
    return new OperationResponseDto(result.code, result.message);
  }
}
