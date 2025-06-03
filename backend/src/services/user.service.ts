import { Injectable } from '@nestjs/common';
import { User } from 'src/interfaces/user.interface';
import { UserDao } from 'src/dao/user.dao';

@Injectable()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  async getUserBySchId(sch_id: string): Promise<User[]> {
    return await this.userDao.getUserBySchId(sch_id);
  }

  async getUserById(id: number): Promise<User[]> {
    return await this.userDao.getUserById(id);
  }

  async getUserDetails() {
    return await this.userDao.getUserDetails();
  }

  async getUserDetailById(id: number) {
    return (await this.userDao.getUserDetailById(id))[0];
  }
}
