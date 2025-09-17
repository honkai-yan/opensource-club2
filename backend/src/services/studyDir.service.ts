import { HttpException, Injectable } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { CommonConstants } from 'src/common/constants';
import { ExceptionEnum } from 'src/common/enums/exception.enum';
import { StudyDirDao } from 'src/dao/studyDir.dao';
import { UserDao } from 'src/dao/user.dao';
import { AddStudyDirDto } from 'src/dto/studyDirs/addStudyDirs.dto';
import { DelStudyDirDto } from 'src/dto/studyDirs/delStudyDir.dto';
import { StudyDirEntity } from 'src/entity/studyDir.entity';
import { StudyDir } from 'src/interfaces/studyDir.interface';

@Injectable()
export class StudyDirService {
  constructor(
    private readonly studyDirDao: StudyDirDao,
    private readonly logger: Logger,
    private readonly userDao: UserDao,
  ) {}

  // 获取所有学习方向
  async getStudyDirs(): Promise<StudyDirEntity[]> {
    try {
      return await this.studyDirDao.getStudyDirs();
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  // 添加一个学习方向
  async add(addStudyDirDto: AddStudyDirDto): Promise<boolean> {
    /**
     * 1.判断单次添加数量是否超出限制
     * 2.判断学习方向是否存在
     * 3.判断指定的leader是否存在
     */

    try {
      const items = addStudyDirDto.items;
      if (items.length > CommonConstants.MAX_STUDY_DIR_ADD_COUNT) {
        throw new Error(
          `单次最多添加${CommonConstants.MAX_STUDY_DIR_ADD_COUNT}个学习方向`,
        );
      }
      // 判断学习方向是否存在
      const existedStudyDirs = await this.studyDirDao.isStudyDirsExistByName(
        items.map((item) => item.name),
      );
      if (existedStudyDirs.length > 0) {
        throw new Error(`学习方向已存在`);
      }
      // 判断leader是否存在
      for (const item of items) {
        const user = await this.userDao.getUserById(item.leader_id);
        if (!user) {
          throw new Error(`id为${item.leader_id}的用户不存在`);
        }
      }
      await this.studyDirDao.add(addStudyDirDto);
      return true;
    } catch (error) {
      if (
        error &&
        (error.message.includes('学习') || error.message.includes('用户'))
      ) {
        throw new HttpException(error.message, 400);
      }
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }

  async del(delStudyDirDto: DelStudyDirDto): Promise<boolean> {
    try {
      // 直接删除
      const { id } = delStudyDirDto;
      const affectedRows = await this.studyDirDao.del(id);
      if (affectedRows > 0) return true;
      return false;
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        ExceptionEnum.InternalServerErrorException,
        ExceptionEnum.InternalServerErrorExceptionCode,
      );
    }
  }
}
