import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FrpService } from './frp.service';
import { nocodbProvider } from './nocodb.provider';
import { PublicationService } from './publication.service';

@Module({
  imports: [HttpModule],
  providers: [FacultyService, nocodbProvider, FrpService, PublicationService],
  exports: [FacultyService, nocodbProvider, FrpService, PublicationService]
})
export class NocodbModule {}
