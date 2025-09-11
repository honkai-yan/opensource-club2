import { HttpException, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { GroupDao } from 'src/dao/group.dao';
import { AddGroupDto } from 'src/dto/group/addGroup.dto';
import { GroupAddUserDto } from 'src/dto/group/groupAddUser.dto';
import { GroupDelUserDto } from 'src/dto/group/groupDelUser.dto';
import { UpdateGroupInfoDto } from 'src/dto/group/updateInfo.dto';
import { Group } from 'src/interfaces/group.interface';
import { User } from 'src/interfaces/user.interface';
import { DelGroupDto } from 'src/dto/group/delGroup.dto';
import { DatabaseService } from './database.service';
import { CommonConstants } from 'src/common/constants';
import { UserDao } from 'src/dao/user.dao';

@Injectable()
export class GroupService {
  constructor(
    private readonly groupDao: GroupDao,
    private readonly logger: Logger,
    private readonly dbService: DatabaseService,
    private readonly userDao: UserDao,
  ) {}

  async getGroups(): Promise<Group[]> {
    try {
      return await this.groupDao.getGroups();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async updateInfoById(newInfo: UpdateGroupInfoDto): Promise<number> {
    try {
      return await this.dbService.runTransaction<number>(async (conn) => {
        // 判断小组是否存在
        const isGroupExist = await this.groupDao.isGroupExist(newInfo.id, conn);
        if (!isGroupExist) {
          throw new Error('小组不存在');
        }
        return await this.groupDao.updateInfoById(newInfo, conn);
      });
    } catch (error) {
      if (error && error.message.includes('小组')) {
        throw new HttpException(error.message, 400);
      }
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async addUser(addUserDto: GroupAddUserDto): Promise<boolean> {
    try {
      return await this.dbService.runTransaction<boolean>(async (conn) => {
        const { groupId, users } = addUserDto;
        // 判断小组是否存在
        const isGroupExist = await this.groupDao.isGroupExist(groupId, conn);
        if (!isGroupExist) {
          throw new Error('小组不存在');
        }

        // 检查单次添加的用户数量是否达上限
        if (users.length > CommonConstants.MAX_GROUP_USER_ADD_COUNT) {
          throw new Error('单次添加的用户数量已达20上限');
        }

        // 检查小组的用户数是否已达上限
        const groupUserNumber = await this.groupDao.getGroupUserNumber(
          groupId,
          conn,
        );
        if (
          groupUserNumber + users.length >
          CommonConstants.MAX_GROUP_MEMBER_COUNT
        ) {
          throw new Error('小组人数已达上限');
        }

        // 判断用户是否存在
        const unknownUsers = await this.userDao.isUsersExist(users, conn);
        if (unknownUsers.length > 0) {
          throw new Error(`id为 ${unknownUsers[0]} 的用户不存在`);
        }

        // 插入用户
        return await this.groupDao.addUser(addUserDto, conn);
      });
    } catch (error) {
      if (
        error &&
        (error.message.includes('小组') || error.message.includes('用户'))
      ) {
        throw new HttpException(error.message, 400);
      } else {
        this.logger.error(error);
        throw new HttpException(
          ExceptionEnum.InternalServerErrorException,
          ExceptionEnum.InternalServerErrorExceptionCode,
        );
      }
    }
  }

  async delUser(delUserDto: GroupDelUserDto): Promise<boolean> {
    try {
      return await this.dbService.runTransaction<boolean>(async (conn) => {
        const { groupId, users } = delUserDto;
        // 判断小组是否存在
        const isGroupExist = await this.groupDao.isGroupExist(groupId, conn);
        if (!isGroupExist) {
          throw new Error('小组不存在');
        }
        // 删除用户
        return await this.groupDao.delUser(delUserDto, conn);
      });
    } catch (error) {
      if (error && error.message.includes('小组')) {
        throw new HttpException(error.message, 400);
      }
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async getUsers(groupId: number): Promise<User[]> {
    try {
      return await this.dbService.runTransaction<User[]>(async (conn) => {
        // 判断小组是否存在
        const isGroupExist = await this.groupDao.isGroupExist(groupId);
        if (!isGroupExist) {
          throw new Error('小组不存在');
        }
        // 获取该小组所有成员
        return await this.groupDao.getUsers(groupId);
      });
    } catch (error) {
      if (error && error.message.includes('小组')) {
        throw new HttpException(error.message, 400);
      }
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async attachStudyDir(groupId: number, studyDirId: number): Promise<boolean> {
    try {
      return await this.dbService.runTransaction<boolean>(async (conn) => {
        // 判断小组是否存在
        const isGroupExist = await this.groupDao.isGroupExist(groupId);
        if (!isGroupExist) {
          throw new Error('小组不存在');
        }
        // 绑定学习方向
        return await this.groupDao.attachStudyDir(groupId, studyDirId);
      });
    } catch (error) {
      if (error && error.message.includes('小组')) {
        throw new HttpException(error.message, 400);
      }
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async add(addGroupDto: AddGroupDto): Promise<boolean> {
    try {
      await this.groupDao.add(addGroupDto);
      return true;
    } catch (error) {
      if (error && error.errno === 1062) {
        throw new HttpException(
          ExceptionEnum.DuplicateGroupException,
          ExceptionEnum.DuplicateGroupExceptionCode,
        );
      } else {
        this.logger.error(error);
        throw new HttpException(
          ExceptionEnum.InternalServerErrorException,
          ExceptionEnum.InternalServerErrorExceptionCode,
        );
      }
    }
  }

  async del(delGroupDto: DelGroupDto) {
    try {
      return await this.groupDao.del(delGroupDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }
}
