import { Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { DatabaseService } from './database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getUserBySchId(sch_id: string): Promise<User[]> {
    return await this.databaseService.query(
      'SELECT * FROM users WHERE sch_id = ?',
      [sch_id],
    );
  }

  async getUserById(id: number): Promise<User[]> {
    return await this.databaseService.query(
      'SELECT * FROM users WHERE id = ?',
      [id],
    );
  }

  async getAllUsersDetails() {
    return await this.databaseService.query('');
  }
}
