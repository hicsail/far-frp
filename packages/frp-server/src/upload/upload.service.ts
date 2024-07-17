import { Injectable } from '@nestjs/common';
import { FacultyService } from '../nocodb/faculty.service';

@Injectable()
export class UploadService {
  constructor(private readonly facultyService: FacultyService) {}

  async handleUpload(facultyID: string) {
    // Get the FRP's associated with the faculty
    const frpTitles = (await this.facultyService.getFRPLinks(facultyID));
    console.log(frpTitles);
  }
}
