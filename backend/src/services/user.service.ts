import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { UserDao } from 'src/dao/user.dao';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { OperationResult } from 'src/interfaces/common/operationResult.interface';
import { ExceptionEnum } from 'src/common/enums/exception.enum';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async getUserBySchId(sch_id: string): Promise<User[]> {
    return await this.userDao.getUserBySchId(sch_id);
  }

  async getUserDetailById(id: number) {
    try {
      const userDetail = await this.userDao.getUserDetailById(id);
      return userDetail;
    } catch (e) {
      console.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async getUserById(id: number): Promise<User[]> {
    return await this.userDao.getUserById(id);
  }

  async getProfiles() {
    return await this.userDao.getProfiles();
  }

  async getProfileById(id: number) {
    return (await this.userDao.getProfileById(id))[0];
  }

  async updateProfileById(
    id: number,
    updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<OperationResult> {
    try {
      const affectedRows = await this.userDao.updateProfileById(
        id,
        updateUserProfileDto,
      );

      if (affectedRows === 0) {
        return {
          code: ExceptionEnum.UserNotFoundExceptionCode as number,
          message: ExceptionEnum.UserNotFoundException as string,
        };
      }

      return {
        code: 200,
        message: '操作成功',
      };
    } catch (e) {
      console.error(e);
      return {
        code: ExceptionEnum.InternalServerErrorExceptionCode as number,
        message: ExceptionEnum.InternalServerErrorException as string,
      };
    }
  }
}
