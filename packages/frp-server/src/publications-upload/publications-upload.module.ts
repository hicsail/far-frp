import { Module } from '@nestjs/common';
import { JobModule } from 'src/job/job.module';
import { NocodbModule } from '../nocodb/nocodb.module';
import { PublicationsUploadController } from './publications-upload.controller';
import { PublicationsUploadService } from './publications-upload.service';

@Module({
  controllers: [PublicationsUploadController],
  providers: [PublicationsUploadService],
  imports: [NocodbModule, JobModule]
})
export class PublicationsUploadModule {}
