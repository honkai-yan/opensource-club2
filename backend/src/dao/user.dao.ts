import { Injectable } from '@nestjs/common';
import { OkPacketParams } from 'mysql2';
import { AddUserDto } from 'src/dto/addUser.dto';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { UserDetailDto } from 'src/dto/userDetail.dto';
import { UserProfileDto } from 'src/dto/userProfile.dto';
import { User } from 'src/interfaces/user.interface';
import { UserRole } from 'src/interfaces/userRole.interface';
import { DatabaseService } from 'src/services/database.service';
import bcryptjs from 'bcryptjs';
import mysql from 'mysql2/promise';
import { AdminUpdateUserDto } from 'src/dto/adminUpdateUser.dto';

@Injectable()
export class UserDao {
  private readonly getUserProfileSqlBase = `
      select
          u.id,
          u.name,
          u.nick_name,
          u.description,
          u.avatar_src,
          p.name as role,
          sd.name as direction,
          d.name as department
      from users u
      -- 职位
      left join users_positions up on u.id = up.user_id
      left join positions p on up.pos_id = p.id
      -- 学习方向
      left join users_study_directions usd on u.id = usd.user_id
      left join study_directions sd on usd.study_dir_id = sd.id
      -- 部门
      left join users_departments ud on u.id = ud.user_id
      left join departments d on ud.dep_id = d.id
    `;

  private readonly getUserDetailSqlBase = `
      select
        u.id,
        u.name,
        u.nick_name,
        u.description,
        u.avatar_src,
        p.name as role,
        sd.name as direction,
        d.name as department,
        u.sch_id,
        u.cur_point,
        u.total_point,
        u.join_date,
        u.delete_date,
        u.is_deleted
      from users u
      -- 职位
      left join users_positions up on u.id = up.user_id
      left join positions p on up.pos_id = p.id
      -- 学习方向
      left join users_study_directions usd on u.id = usd.user_id
      left join study_directions sd on usd.study_dir_id = sd.id
      -- 部门
      left join users_departments ud on u.id = ud.user_id
      left join departments d on ud.dep_id = d.id
  `;

  constructor(private readonly dbService: DatabaseService) {}

  async getUserBySchId(sch_id: string): Promise<User> {
    return (
      await this.dbService.query<User>(
        'SELECT * FROM users WHERE sch_id = ? and is_deleted = 0',
        [sch_id],
      )
    )[0];
  }

  async getUserById(id: number): Promise<User> {
    return (
      await this.dbService.query<User>(
        'SELECT * FROM users WHERE id = ? and is_deleted = 0',
        [id],
      )
    )[0];
  }

  async getUserDetailById(id: number): Promise<UserDetailDto> {
    return (
      await this.dbService.query<UserDetailDto>(
        this.getUserDetailSqlBase + 'where u.id = ? and is_deleted = 0',
        [id],
      )
    )[0];
  }

  async getProfiles() {
    return await this.dbService.query<UserProfileDto>(
      this.getUserProfileSqlBase + 'where u.is_deleted = 0',
    );
  }

  async getProfileById(id: number): Promise<UserProfileDto> {
    return (
      await this.dbService.query<UserProfileDto>(
        this.getUserProfileSqlBase + ' WHERE u.id = ? and u.is_deleted = 0',
        [id],
      )
    )[0];
  }

  async updateProfileById(id: number, updateProfileDto: UpdateUserProfileDto) {
    const { nickname, description } = updateProfileDto;
    const res = await this.dbService.runTransaction<OkPacketParams>(
      async (conn) => {
        // 悲观锁
        await conn.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [id]);
        const [res] = await conn.query(
          `update users set nick_name = ?, description = ? where id = ?`,
          [nickname, description, id],
        );
        return res as OkPacketParams;
      },
    );
    return res.affectedRows;
  }

  async getUserRoleById(id: number): Promise<UserRole> {
    const res = await this.dbService.query<UserRole>(
      'select p.name from positions p join users_positions up on p.id = up.pos_id join users u on up.user_id = u.id where u.id = ?;',
      [id],
    );
    return res[0];
  }

  async addUser(user: User, conn?: mysql.Connection): Promise<number> {
    const { name, sch_id, password } = user;
    const oldUser = await this.getUserBySchId(sch_id);
    if (oldUser) return 0;
    const sql = `insert into users (name, sch_id, password, join_date) values (?, ?, ?, now())`;
    const values = [name, sch_id, password];
    let res: OkPacketParams;
    if (conn) {
      res = (await conn.execute(sql, values)) as OkPacketParams;
    } else {
      res = await this.dbService.execute(sql, values);
    }
    return res.affectedRows;
  }

  async delUserById(id: number): Promise<number> {
    const res = await this.dbService.runTransaction<OkPacketParams>(
      async (conn) => {
        const [res] = await conn.execute(
          'update users set is_deleted = 1 where id = ?',
          [id],
        );
        return res as OkPacketParams;
      },
    );
    return res.affectedRows;
  }

  /**
   * 批量添加用户
   * @param userList 要添加的用户的列表
   * @returns 若用户列表为空，则返回0，执行成功则返回1，否则抛出错误
   */
  async addUserBatch(userList: AddUserDto[]): Promise<number> {
    if (userList.length === 0) return 0;
    // 循环插入每一个用户，遇到重复用户时抛出这个用户，然后回退
    await this.dbService.runTransaction<void>(async (conn) => {
      for (const user of userList) {
        const password = await bcryptjs.hash('123456', 10);
        const { name, sch_id } = user;
        const newUser: User = {
          name,
          sch_id,
          password,
        };
        const res = await this.addUser(newUser, conn);
        if (res === 0) throw new Error(`用户${name}已存在`);
      }
    });
    return 1;
  }

  /**
   * 批量删除用户
   * @param userIdList 被批量删除的用户id的列表
   * @returns 无
   */
  async delUserBatch(userIdList: number[]): Promise<void> {
    await this.dbService.runTransaction(async (conn) => {
      for (const id of userIdList) {
        await this.delUserById(id);
      }
    });
  }

  /**
   * 管理员更新用户信息
   * @param userNewInfo 管理员更新用户信息
   * @returns 返回受影响的行数
   */
  async adminUpdateUser(userNewInfo: AdminUpdateUserDto): Promise<number> {
    const { id, name, sch_id, cur_point, total_point } = userNewInfo;
    const res = await this.dbService.runTransaction<OkPacketParams>(
      async (conn) => {
        // 悲观锁
        await conn.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [id]);
        const [result] = await conn.query(
          `UPDATE users SET name = ?, sch_id = ?, cur_point = ?, total_point = ? WHERE id = ?`,
          [name, sch_id, cur_point, total_point, id],
        );
        return result as OkPacketParams;
      },
    );
    return res.affectedRows;
  }
}
