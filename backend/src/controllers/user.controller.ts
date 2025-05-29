import { Controller, Post } from '@nestjs/common';

@Controller('/user')
export class UserController {
  constructor() {}

  @Post('/get-all')
  async getAllUserDetails() {

  }
}
