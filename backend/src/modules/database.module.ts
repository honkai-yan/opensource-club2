import { Module } from '@nestjs/common';
import { DatabaseService } from 'src/services/database.service';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
