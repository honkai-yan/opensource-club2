import { Body, Controller, Get, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ResponseResultDto } from 'src/dto/responseResult.dto';
import { AddStudyDirDto } from 'src/dto/studyDirs/addStudyDirs.dto';
import { DelStudyDirDto } from 'src/dto/studyDirs/delStudyDir.dto';
import { StudyDirDto as GetStudyDirDto } from 'src/dto/studyDirs/getStudyDir.dto';
import { StudyDirService } from 'src/services/studyDir.service';

@Controller('studyDir')
export class StudyDirController {
  constructor(private readonly studyDirService: StudyDirService) {}

  @Get('getStudyDirs')
  async getStudyDirs() {
    const res = await this.studyDirService.getStudyDirs();
    const resDto = plainToInstance(GetStudyDirDto, res);
    return new ResponseResultDto<GetStudyDirDto[]>(200, '获取成功', resDto);
  }

  @Post('add')
  async add(@Body() addStudyDirDto: AddStudyDirDto) {
    const res = await this.studyDirService.add(addStudyDirDto);
    if (res) {
      return new ResponseResultDto(200, '添加成功');
    }
    return new ResponseResultDto(500, '添加失败');
  }

  @Post('del')
  async del(@Body() delStudyDirDto: DelStudyDirDto) {
    const res = await this.studyDirService.del(delStudyDirDto);
    if (res) {
      return new ResponseResultDto(200, '删除成功');
    }
    return new ResponseResultDto(500, '删除失败');
  }
}
