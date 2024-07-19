import { Injectable } from '@nestjs/common';
import { FrpService } from 'src/nocodb/frp.service';
import { FacultyService } from '../nocodb/faculty.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly frpService: FrpService
  ) {}

  async handleUpload(facultyID: string) {
    // Get the FRP's associated with the faculty
    const frpIDs = (await this.facultyService.getFRPLinks(facultyID)).map((frp) => frp.Id);
    const frps = await Promise.all(frpIDs.map((frpID) => this.frpService.getFRP(frpID.toString())));
  }

  async handleAnalysisCompletion() {
    // Get all publications from the
  }
}
