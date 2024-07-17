import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FrpService } from './frp.service';
import { nocodbProvider } from './nocodb.provider';

@Module({
  imports: [HttpModule],
  providers: [FacultyService, nocodbProvider, FrpService],
  exports: [FacultyService, nocodbProvider, FrpService]
})
export class NocodbModule {}
