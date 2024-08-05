import { Module } from '@nestjs/common';
import { GrantsUploadService } from './grants-upload.service';
import { GrantsUploadController } from './grants-upload.controller';
import { JobModule } from '../job/job.module';
import { NocodbModule } from '../nocodb/nocodb.module';

@Module({
  providers: [GrantsUploadService],
  controllers: [GrantsUploadController],
  imports: [JobModule, NocodbModule]
})
export class GrantsUploadModule {}
