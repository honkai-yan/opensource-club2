import { Injectable } from '@nestjs/common';
import { AddUserDto } from 'src/dto/user/addUser.dto';
import { UpdateUserProfileDto } from 'src/dto/user/updateUserProfile.dto';
import { UserDetailDto } from 'src/dto/user/userDetail.dto';
import { UserProfileDto } from 'src/dto/user/userProfile.dto';
import { User } from 'src/interfaces/user.interface';
import { UserRole } from 'src/interfaces/userRole.interface';
import { DatabaseService } from 'src/services/database.service';
import bcryptjs from 'bcryptjs';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import { AdminUpdateUserDto } from 'src/dto/user/adminUpdateUser.dto';
import { CommonConstants } from 'src/common/constants';

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
        u.id, -- 用户id
        u.name, -- 用户姓名
        u.nick_name, -- 用户昵称
        u.description, -- 用户描述
        u.avatar_src, -- 用户头像
        p.name as role, -- 用户角色
        sd.name as direction, -- 用户学习方向
        d.name as department, -- 用户部门
        u.sch_id, -- 学号
        u.cur_point, -- 当前积分
        u.total_point, -- 总积分
        u.join_date, -- 加入时间
        u.delete_date, -- 删除时间
        u.is_deleted -- 是否被删除
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

  async getProfiles(pageNum: number, pageSize: number) {
    return await this.dbService.query<UserProfileDto>(
      this.getUserProfileSqlBase + 'where u.is_deleted = 0 limit ?, ?',
      [(pageNum - 1) * pageSize, pageSize],
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
    const res = await this.dbService.runTransaction<ResultSetHeader>(
      async (conn) => {
        // 悲观锁
        await conn.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [id]);
        const [res] = await conn.query<ResultSetHeader>(
          `update users set nick_name = ?, description = ? where id = ?`,
          [nickname, description, id],
        );
        return res;
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
    if (!conn) {
      return await this.dbService.runTransaction<number>(async (conn) => {
        return await this._addUserImpl(user, conn);
      });
    }
    return await this._addUserImpl(user, conn);
  }

  async _addUserImpl(use: User, conn: mysql.Connection): Promise<number> {
    const { name, sch_id, password } = use;
    const oldUser = await this.getUserBySchId(sch_id);
    if (oldUser) return 0;

    const addUsersql = `insert into users (name, sch_id, password, join_date) values (?, ?, ?, now())`;
    const addUservalues = [name, sch_id, password];
    const [res] = await conn.execute<ResultSetHeader>(
      addUsersql,
      addUservalues,
    );

    if (res.affectedRows === 0) {
      return res.affectedRows; // 插入失败，用户已存在
    }

    // 默认添加普通用户角色
    const addRoleSql = `insert into users_positions (user_id, pos_id, appoint_date) values (?, ?, now())`;
    const addRoleValues = [res.insertId, CommonConstants.DEFAULT_USER_ROLE_ID];
    await conn.execute(addRoleSql, addRoleValues);

    return res.affectedRows;
  }

  async delUserById(id: number): Promise<number> {
    const res = await this.dbService.runTransaction<ResultSetHeader>(
      async (conn) => {
        const [res] = await conn.execute<ResultSetHeader>(
          'update users set is_deleted = 1 where id = ?',
          [id],
        );
        return res;
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
    const res = await this.dbService.runTransaction<ResultSetHeader>(
      async (conn) => {
        // 悲观锁
        await conn.query('SELECT * FROM users WHERE id = ? FOR UPDATE', [id]);
        const [result] = await conn.query<ResultSetHeader>(
          `UPDATE users SET name = ?, sch_id = ?, cur_point = ?, total_point = ? WHERE id = ?`,
          [name, sch_id, cur_point, total_point, id],
        );
        return result;
      },
    );
    return res.affectedRows;
  }

  // 根据一个id数组判断一组用户是否都存在，如果有不存在的，返回不存在的用户的id的数组，否则返回空数组
  async isUsersExist(
    userIdList: number[],
    conn?: mysql.Connection,
  ): Promise<number[]> {
    const sql = `select id from users where id in (?)`;
    const res = await this.dbService.query<number>(
      sql,
      [userIdList.join(',')],
      conn,
    );
    if (res.length === userIdList.length) return [];
    return userIdList.filter((id) => !res.includes(id));
  }
}
