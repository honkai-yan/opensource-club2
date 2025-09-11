import { Body, Controller, Get, Injectable, Param, Post } from '@nestjs/common';
import { AddGroupDto } from 'src/dto/group/addGroup.dto';
import { AttachStudyDirDto } from 'src/dto/group/attachStudyDir.dto';
import { DelGroupDto } from 'src/dto/group/delGroup.dto';
import { GroupAddUserDto } from 'src/dto/group/groupAddUser.dto';
import { GroupDelUserDto } from 'src/dto/group/groupDelUser.dto';
import { UpdateGroupInfoDto } from 'src/dto/group/updateInfo.dto';
import { ResponseResultDto } from 'src/dto/responseResult.dto';
import { Group } from 'src/interfaces/group.interface';
import { User } from 'src/interfaces/user.interface';
import { GroupService } from 'src/services/group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get('getGroups')
  async getGroups() {
    return new ResponseResultDto<Group[]>(
      200,
      '操作成功',
      await this.groupService.getGroups(),
    );
  }

  @Post('updateInfoById')
  async updateInfoById(@Body() updateInfoDto: UpdateGroupInfoDto) {
    await this.groupService.updateInfoById(updateInfoDto);
    return new ResponseResultDto<null>(200, '操作成功');
  }

  @Post('addUser')
  async addUser(@Body() addUserDto: GroupAddUserDto) {
    const ok = await this.groupService.addUser(addUserDto);
    if (ok) {
      return new ResponseResultDto<null>(200, '添加用户成功');
    } else {
      return new ResponseResultDto<null>(500, '添加用户失败');
    }
  }

  @Post('delUser')
  async delUser(@Body() delUserDto: GroupDelUserDto) {
    const ok = await this.groupService.delUser(delUserDto);
    if (ok) {
      return new ResponseResultDto<null>(200, '删除用户成功');
    } else {
      return new ResponseResultDto<null>(500, '删除用户失败');
    }
  }

  @Get('getUsers/:groupId')
  async getUsers(@Param('groupId') groupId: number) {
    const res = await this.groupService.getUsers(groupId);
    return new ResponseResultDto<User[]>(200, '操作成功', res);
  }

  @Post('attachStudyDir')
  async attachStudyDir(@Body() attachStudyDirDto: AttachStudyDirDto) {
    const { groupId, dir } = attachStudyDirDto;
    const ok = await this.groupService.attachStudyDir(groupId, dir);
    if (ok) {
      return new ResponseResultDto(200, '关联学习方向成功');
    } else {
      return new ResponseResultDto(500, '关联学习方向失败');
    }
  }

  @Post('add')
  async add(@Body() addGroupDto: AddGroupDto) {
    const ok = await this.groupService.add(addGroupDto);
    if (ok) {
      return new ResponseResultDto(200, '添加小组成功');
    } else {
      return new ResponseResultDto(500, '添加小组失败');
    }
  }

  @Post('del')
  async del(@Body() delGroupDto: DelGroupDto) {
    const ok = await this.groupService.del(delGroupDto);
    if (ok) {
      return new ResponseResultDto(200, '删除小组成功');
    } else {
      return new ResponseResultDto(500, '删除小组失败');
    }
  }
}
