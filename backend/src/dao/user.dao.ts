import { Injectable } from '@nestjs/common';
import { OkPacketParams } from 'mysql2';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { UserDetailDto } from 'src/dto/userDetail.dto';
import { UserProfileDto } from 'src/dto/userProfile.dto';
import { User } from 'src/interfaces/user.interface';
import { UserRole } from 'src/interfaces/userRole.interface';
import { DatabaseService } from 'src/services/database.service';

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
      await this.dbService.query<User>('SELECT * FROM users WHERE sch_id = ?', [
        sch_id,
      ])
    )[0];
  }

  async getUserById(id: number): Promise<User> {
    return (
      await this.dbService.query<User>('SELECT * FROM users WHERE id = ?', [id])
    )[0];
  }

  async getUserDetailById(id: number): Promise<UserDetailDto> {
    return (
      await this.dbService.query<UserDetailDto>(
        this.getUserDetailSqlBase + 'where u.id = ?',
        [id],
      )
    )[0];
  }

  async getProfiles() {
    return await this.dbService.query<UserProfileDto>(
      this.getUserProfileSqlBase,
    );
  }

  async getProfileById(id: number): Promise<UserProfileDto> {
    return (
      await this.dbService.query<UserProfileDto>(
        this.getUserProfileSqlBase + ' WHERE u.id = ?',
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

  async addUser(user: User) {
    const { name, sch_id, password } = user;
    const res = await this.dbService.runTransaction<OkPacketParams>(
      async (conn) => {
        const [res] = await conn.query(
          `insert into users (name, sch_id, password, join_date) values (?, ?, ?, now())`,
          [name, sch_id, password],
        );
        return res as OkPacketParams;
      },
    );
    return res.affectedRows;
  }
}
