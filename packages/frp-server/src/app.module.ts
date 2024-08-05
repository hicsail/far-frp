import { Module } from '@nestjs/common';
import { NocodbModule } from './nocodb/nocodb.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { PublicationsUploadModule } from './publications-upload/publications-upload.module';
import { GrantsUploadModule } from './grants-upload/grants-upload.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    NocodbModule,
    JobModule,
    PublicationsUploadModule,
    GrantsUploadModule
  ]
})
export class AppModule {}
