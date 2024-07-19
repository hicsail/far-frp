import { Injectable } from '@nestjs/common';
import { Publication } from '../nocodb/dto/publication.dto';
import { FrpService } from '../nocodb/frp.service';
import { FacultyService } from '../nocodb/faculty.service';
import { AnalysisCompletion } from './dto/completion.dto';
import { PublicationService } from '../nocodb/publication.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly facultyService: FacultyService,
    private readonly frpService: FrpService,
    private readonly publicationService: PublicationService
  ) {}

  async handleUpload(facultyID: string) {
    // Get the FRP's associated with the faculty
    const frpIDs = (await this.facultyService.getFRPLinks(facultyID)).map((frp) => frp.Id);
    const frps = await Promise.all(frpIDs.map((frpID) => this.frpService.getFRP(frpID.toString())));

    // Store the needed information on the job

    // Start the job
  }

  async handleAnalysisCompletion(analysisResults: AnalysisCompletion): Promise<void> {
    // Get all publications from the matching
    const publications = await this.getOrCreatePublications(analysisResults);

    // Link the publications with the associated faculty

    // Link the publications with the associated FRP
  }

  /**
   * Will loop over all the publications from the analysis and either create new ones if they
   * don't exist or return the existing ones
   */
  private async getOrCreatePublications(analysisResults: AnalysisCompletion): Promise<Publication[]> {
    return Promise.all(analysisResults.results.map(async (match) => {
      const existing = await this.publicationService.findByTitle(match.title);
      if (existing) {
        return existing;
      }
      return this.publicationService.create(match.title, match.journal, match.publicationDate);
    }));
  }
}
