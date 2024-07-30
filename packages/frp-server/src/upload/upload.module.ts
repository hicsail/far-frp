import { Module } from '@nestjs/common';
import { JobModule } from '../job/job.module';
import { NocodbModule } from '../nocodb/nocodb.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [NocodbModule, JobModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
