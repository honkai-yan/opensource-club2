import { Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { GroupAddUserDto } from 'src/dto/group/groupAddUser.dto';
import { UpdateGroupInfoDto } from 'src/dto/group/updateInfo.dto';
import { Group } from 'src/interfaces/group.interface';
import { DatabaseService } from 'src/services/database.service';
import mysql from 'mysql2/promise';
import { UserService } from 'src/services/user.service';
import { GroupDelUserDto } from 'src/dto/group/groupDelUser.dto';
import { User } from 'src/interfaces/user.interface';
import { AddGroupDto } from 'src/dto/group/addGroup.dto';
import { DelGroupDto } from 'src/dto/group/delGroup.dto';
import { Logger } from 'nestjs-pino';
import { CommonConstants } from 'src/common/constants';
import { AddUserDto } from 'src/dto/user/addUser.dto';

@Injectable()
export class GroupDao {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  // 获取所有小组
  async getGroups(): Promise<Group[]> {
    return this.dbService.query<Group>('select * from `groups`');
  }

  // 判断某个小组是否存在
  async isGroupExist(
    groupId: number,
    conn?: mysql.Connection,
  ): Promise<boolean> {
    const sql = 'select * from `groups` where id = ?';
    const group = await this.dbService.query<Group>(sql, [groupId], conn);
    if (!group || group.length === 0) {
      return false;
    }
    return true;
  }

  // 根据id修改某个小组的基本信息
  async updateInfoById(
    newInfo: UpdateGroupInfoDto,
    conn?: mysql.Connection,
  ): Promise<number> {
    const sql = 'update `groups` set name = ?,description = ? where id = ?';
    const res = await this.dbService.execute(
      sql,
      [newInfo.name, newInfo.description, newInfo.id],
      conn,
    );
    return res.affectedRows;
  }

  async getGroupUserNumber(
    groupId: number,
    conn?: mysql.Connection,
  ): Promise<number> {
    const sql = 'select count(*) as cnt from `users_groups` where group_id = ?';
    return await this.dbService.query<{ cnt: number }>(sql, [groupId], conn)[0]
      .cnt;
  }

  async addUser(
    addUserDto: GroupAddUserDto,
    conn?: mysql.Connection,
  ): Promise<boolean> {
    const { groupId, users } = addUserDto;
    let sql = 'insert into users_groups (user_id, group_id, join_date) values ';
    const values = [];
    for (const userId of users) {
      sql += `(?, ?, now()),`;
      values.push(userId, groupId);
    }
    sql = sql.slice(0, -1);
    await this.dbService.execute(sql, values, conn);
    return true;
  }

  async delUser(
    delUserDto: GroupDelUserDto,
    conn?: mysql.Connection,
  ): Promise<boolean> {
    const { groupId, users } = delUserDto;
    const sql =
      'delete from users_groups where user_id in (?) and group_id = ?';
    await this.dbService.execute(sql, [users.join(','), groupId], conn);
    return true;
  }

  async getUsers(groupId: number, conn?: mysql.Connection): Promise<User[]> {
    const sql =
      'select u.* from users_groups ug join users u on u.id = ug.user_id where ug.group_id = ?';
    return await this.dbService.query<User>(sql, [groupId], conn);
  }

  async attachStudyDir(
    groupId: number,
    studyDirId: number,
    conn?: mysql.Connection,
  ): Promise<boolean> {
    const sql = 'update `groups` set study_dir_id = ? where id = ?';
    await this.dbService.execute(
      sql,
      [studyDirId === -1 ? null : studyDirId, groupId],
      conn,
    );
    return true;
  }

  // 添加一个小组
  async add(
    addGroupDto: AddGroupDto,
    conn?: mysql.Connection,
  ): Promise<boolean> {
    const { name, description, studyDirId } = addGroupDto;
    const paraArr = [name, description, studyDirId];
    let pCnt = 0;
    let sql = 'insert into `groups` (create_date, name';
    if (description) {
      sql += ', description';
      ++pCnt;
    }
    if (studyDirId) {
      sql += ', study_dir_id';
      ++pCnt;
    }
    sql += ') values (now(), ?';
    for (let i = 0; i < pCnt; ++i) {
      sql += ', ?';
    }
    sql += ')';

    await this.dbService.execute(sql, paraArr.slice(0, pCnt + 1), conn);
    return true;
  }

  // 删除小组
  async del(
    delGroupDto: DelGroupDto,
    conn?: mysql.Connection,
  ): Promise<boolean> {
    const { groupId } = delGroupDto;
    const sql = 'delete from `groups` where id = ?';
    await conn.query(sql, [groupId]);
    // 同步删除小组下的用户
    await this.dbService.execute(
      'delete from users_groups where group_id = ?',
      [groupId],
      conn,
    );
    return true;
  }
}
