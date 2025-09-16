import { Module } from '@nestjs/common';
import { StudyDirService } from 'src/services/studyDir.service';
import { DatabaseModule } from './database.module';
import { StudyDirController } from 'src/controllers/studyDir.controller';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [DatabaseModule],
  providers: [StudyDirService],
  controllers: [StudyDirController],
})
export class StudyDirModule {}
