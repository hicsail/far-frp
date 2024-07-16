import { Module } from '@nestjs/common';
import { NocodbModule } from '../nocodb/nocodb.module';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [NocodbModule],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
