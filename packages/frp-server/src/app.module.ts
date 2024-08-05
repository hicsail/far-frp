import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { NocodbModule } from './nocodb/nocodb.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import { PublicationsModule } from './publications/publications.module';
import { GrantsModule } from './grants/grants.module';
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
    PublicationsModule,
    GrantsModule
  ],
})
export class AppModule {}
