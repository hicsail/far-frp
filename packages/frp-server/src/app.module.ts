import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { NocodbModule } from './nocodb/nocodb.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { PublicationsUploadModule } from './publications-upload/publications-upload.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    UploadModule,
    NocodbModule,
    JobModule,
    PublicationsUploadModule,
  ],
})
export class AppModule {}
