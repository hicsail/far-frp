import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';

@Module({
  imports: [HttpModule],
  providers: [FacultyService],
  exports: [FacultyService]
})
export class NocodbModule {}
