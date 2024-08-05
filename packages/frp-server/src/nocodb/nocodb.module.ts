import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FrpService } from './frp.service';
import { GrantsUploadService } from './grants-upload.service';
import { nocodbProvider } from './nocodb.provider';
import { PublicationUploadService } from './publication-upload.service';
import { PublicationService } from './publication.service';

@Module({
  imports: [HttpModule],
  providers: [FacultyService, nocodbProvider, FrpService, PublicationService, PublicationUploadService, GrantsUploadService],
  exports: [FacultyService, nocodbProvider, FrpService, PublicationService, PublicationUploadService, GrantsUploadService]
})
export class NocodbModule {}
