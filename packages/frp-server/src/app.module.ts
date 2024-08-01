import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { NocodbModule } from './nocodb/nocodb.module';
import { ConfigModule } from '@nestjs/config';
import { JobModule } from './job/job.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    UploadModule,
    NocodbModule,
    JobModule
  ],
  providers: [AppService]
})
export class AppModule {}
