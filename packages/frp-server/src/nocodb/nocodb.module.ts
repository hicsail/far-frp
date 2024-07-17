import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { nocodbProvider } from './nocodb.provider';

@Module({
  imports: [HttpModule],
  providers: [FacultyService, nocodbProvider],
  exports: [FacultyService, nocodbProvider]
})
export class NocodbModule {}
