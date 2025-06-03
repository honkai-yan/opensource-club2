import { Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { DatabaseService } from 'src/services/database.service';

@Injectable()
export class UserDao {
  private readonly getUserDetailSqlBase = `
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

  constructor(private readonly dbService: DatabaseService) {}

  async getUserBySchId(sch_id: string): Promise<User[]> {
    return await this.dbService.query('SELECT * FROM users WHERE sch_id = ?', [
      sch_id,
    ]);
  }

  async getUserById(id: number): Promise<User[]> {
    return await this.dbService.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  async getUserDetails() {
    return await this.dbService.query(this.getUserDetailSqlBase);
  }

  async getUserDetailById(id: number) {
    return await this.dbService.query<User[]>(
      this.getUserDetailSqlBase + ' WHERE u.id = ?',
      [id],
    );
  }
}
