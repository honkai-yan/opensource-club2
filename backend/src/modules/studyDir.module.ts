import { Module } from '@nestjs/common';
import { StudyDirService } from 'src/services/studyDir.service';
import { DatabaseModule } from './database.module';
import { StudyDirController } from 'src/controllers/studyDir.controller';
import { LoggerModule } from 'nestjs-pino';
import { StudyDirDao } from 'src/dao/studyDir.dao';
import { UserModule } from './user.module';

@Module({
  imports: [DatabaseModule, UserModule],
  providers: [StudyDirService, StudyDirDao],
  controllers: [StudyDirController],
})
export class StudyDirModule {}
