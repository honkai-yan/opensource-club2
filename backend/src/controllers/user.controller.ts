import { Controller, Post } from '@nestjs/common';
import { UserService } from 'src/services/user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/getAllDetails')
  async getUserDetails() {
    return await this.userService.getUserDetails();
  }

  @Post('/getDetailById')
  async getUserDetailById(id: number) {}
}
