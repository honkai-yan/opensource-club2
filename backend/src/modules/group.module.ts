import { Module } from '@nestjs/common';
import { UserModule } from './user.module';
import { GroupService } from 'src/services/group.service';
import { GroupController } from 'src/controllers/group.controller';
import { GroupDao } from 'src/dao/group.dao';

@Module({
  imports: [UserModule],
  providers: [GroupService, GroupDao],
  controllers: [GroupController],
})
export class GroupModule {}
