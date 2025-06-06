import { Injectable } from '@nestjs/common';
import { OkPacketParams } from 'mysql2';
import { UpdateUserProfileDto } from 'src/dto/updateUserProfile.dto';
import { UserDetailDto } from 'src/dto/userDetail.dto';
import { User } from 'src/interfaces/user.interface';
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

  async getUserBySchId(sch_id: string): Promise<User[]> {
    return await this.dbService.query('SELECT * FROM users WHERE sch_id = ?', [
      sch_id,
    ]);
  }

  async getUserById(id: number): Promise<User[]> {
    return await this.dbService.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  async getUserDetailById(id: number): Promise<UserDetailDto> {
    return (
      await this.dbService.query<UserDetailDto>(this.getUserDetailSqlBase, [id])
    )[0];
  }

  async getProfiles() {
    return await this.dbService.query(this.getUserProfileSqlBase);
  }

  async getProfileById(id: number) {
    return await this.dbService.query<User[]>(
      this.getUserProfileSqlBase + ' WHERE u.id = ?',
      [id],
    );
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
}
