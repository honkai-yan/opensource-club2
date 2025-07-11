import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { UserDao } from 'src/dao/user.dao';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { OperationResult } from 'src/interfaces/common/operationResult.interface';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { UserProfileDto } from 'src/dto/userProfile.dto';
import { AddUserDto } from 'src/dto/addUser.dto';
import bcrypt from 'bcryptjs';
import { UserRole } from 'src/interfaces/userRole.interface';
import { Logger } from 'nestjs-pino';

@Injectable()
export class UserService {
  constructor(
    private readonly userDao: UserDao,
    private readonly logger: Logger,
  ) {}

  async getUserBySchId(sch_id: string): Promise<User> {
    try {
      return await this.userDao.getUserBySchId(sch_id);
    } catch (e) {
      this.logger.error(e);
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
      this.logger.error(e);
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
      this.logger.error(e);
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
      this.logger.error(e);
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
      this.logger.error(e);
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
      this.logger.error(e);
      return {
        code: ExceptionEnum.InternalServerErrorExceptionCode as number,
        message: ExceptionEnum.InternalServerErrorException as string,
      };
    }
  }

  async getUserRoleById(id: number): Promise<string> {
    try {
      const role = await this.userDao.getUserRoleById(id);
      if (!role) {
        throw new HttpException(
          ExceptionEnum.UserNotFoundException,
          ExceptionEnum.UserNotFoundExceptionCode,
        );
      }
      return role.name;
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async addUser(addUserDto: AddUserDto): Promise<OperationResult> {
    try {
      const password = bcrypt.hashSync('123456', 10);
      const affectedRows = await this.userDao.addUser({
        name: addUserDto.name,
        sch_id: addUserDto.sch_id,
        password,
      });
      if (affectedRows === 0) {
        return {
          code: 500,
          message: '系统错误，请稍后再试',
        };
      }
      return {
        code: 200,
        message: '操作成功',
      };
    } catch (error) {
      if (error.errno === 1062) {
        throw new HttpException(
          ExceptionEnum.DuplicateUserException,
          ExceptionEnum.DuplicateUserExceptionCode,
        );
      }
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async delUserById(id: number): Promise<OperationResult> {
    try {
      const affectedRows = await this.userDao.delUserById(id);
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
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async addUserBatch(userList: AddUserDto[]): Promise<OperationResult> {
    if (userList.length === 0) {
      return {
        code: 400,
        message: '用户列表为空',
      };
    }
    if (userList.length > 200) {
      return {
        code: 400,
        message: '最大添加数量为200个',
      };
    }
    try {
      const affectedRows = await this.userDao.addUserBatch(userList);
      if (affectedRows === 0) {
        return {
          code: 400,
          message: '用户列表为空',
        };
      }
      return {
        code: 200,
        message: '操作成功',
      };
    } catch (error) {
      this.logger.error(error);
      if (error.message.includes('用户')) {
        return {
          code: 409,
          message: error.message,
        };
      }
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }
}
