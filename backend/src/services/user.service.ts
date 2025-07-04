import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { UserDao } from 'src/dao/user.dao';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { OperationResult } from 'src/interfaces/common/operationResult.interface';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { UserProfileDto } from 'src/dto/userProfile.dto';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async getUserBySchId(sch_id: string): Promise<User> {
    try {
      return await this.userDao.getUserBySchId(sch_id);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
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

  async getUserById(id: number): Promise<User> {
    try {
      return await this.userDao.getUserById(id);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async getProfiles(): Promise<UserProfileDto[]> {
    try {
      return await this.userDao.getProfiles();
    } catch (e) {
      console.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async getProfileById(id: number): Promise<UserProfileDto> {
    try {
      return await this.userDao.getProfileById(id);
    } catch (e) {
      console.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
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

  async getUserRoleById(id: number): Promise<string> {
    try {
      const profileName = await this.userDao.getUserRoleById(id);
      if (!profileName) {
        throw new HttpException(
          ExceptionEnum.UserNotFoundException,
          ExceptionEnum.UserNotFoundExceptionCode,
        );
      }
      return profileName;
    } catch (e) {
      console.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }
}
