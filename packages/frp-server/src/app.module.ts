import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { NocodbModule } from './nocodb/nocodb.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    UploadModule,
    NocodbModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
