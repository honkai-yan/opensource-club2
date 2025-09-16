import { Injectable } from '@nestjs/common';
import { ResultSetHeader } from 'mysql2';
import { AddStudyDirDto } from 'src/dto/studyDirs/addStudyDirs.dto';
import { StudyDirEntity } from 'src/entity/studyDir.entity';
import { DatabaseService } from 'src/services/database.service';

@Injectable()
export class StudyDirDao {
  constructor(private readonly dbService: DatabaseService) {}

  async getStudyDirs(): Promise<StudyDirEntity[]> {
    return await this.dbService.query<StudyDirEntity>(
      'select * from study_directions;',
    );
  }

  async add(addStudyDirDto: AddStudyDirDto): Promise<boolean> {
    const items = addStudyDirDto.items;
    let sql = 'insert into study_directions (leader_id, name) values ';
    const values = [];
    for (const item of items) {
      sql += `(${item.leader_id}, '${item.name}'),`;
      values.push(item.leader_id, item.name);
    }
    await this.dbService.execute(sql, values);
    return true;
  }

  // 判断一组学习方向是否存在，返回存在的学习方向的id
  async isStudyDirsExistByName(names: string[]) {
    const sql = 'select id from study_directions where name in (?)';
    return await this.dbService.query<number>(sql, [names.join(',')]);
  }

  // 根据id获取一个学习方向
  async getStudyDirById(id: number): Promise<StudyDirEntity> {
    const sql = `select id, leader_id, name from study_directions where id = ?`;
    return await this.dbService.query<StudyDirEntity>(sql, [id])[0];
  }

  // 删除一组学习方向
  async del(ids: number[]): Promise<number> {
    const sql = `delete from study_directions where id in (?)`;
    const res = await this.dbService.execute(sql, [ids.join(',')]);
    return res.affectedRows;
  }
}
