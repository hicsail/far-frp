import { Injectable } from '@nestjs/common';
import { Publication } from '../nocodb/dto/publication.dto';
import { FrpService } from '../nocodb/frp.service';
import { FacultyService } from '../nocodb/faculty.service';
import { AnalysisCompletion } from './dto/completion.dto';
import { PublicationService } from '../nocodb/publication.service';
import { JobService } from '../job/job.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly backendUrl = this.configService.getOrThrow<string>('server.url');
  private readonly nocodbBaseUrl = this.configService.getOrThrow<string>('nocodb.baseUri');

  constructor(
    private readonly facultyService: FacultyService,
    private readonly frpService: FrpService,
    private readonly publicationService: PublicationService,
    private readonly jobService: JobService,
    private readonly configService: ConfigService
  ) {}

  async handleUpload(facultyID: string, csvUrlStub: string) {
    // Get the FRP's associated with the faculty
    const frpIDs = (await this.facultyService.getFRPLinks(facultyID)).map((frp) => frp.Id);
    const frps = await Promise.all(frpIDs.map((frpID) => this.frpService.getFRP(frpID.toString())));

    // TODO: In the future this information will be stored in a seperate DB and ID of
    // that entry will be shared with the job

    // Start the jobs
    for(const frp of frps) {
      await this.jobService.triggerJob(`${this.nocodbBaseUrl}/${csvUrlStub}`, frp.Title, `${this.backendUrl}/upload/complete`, { facultyID, frpID: frp.Id });
    }
  }

  async handleAnalysisCompletion(analysisResults: AnalysisCompletion): Promise<void> {
    // Get all publications from the matching
    const publications = await this.getOrCreatePublications(analysisResults);

    // Link the publications with the associated faculty
    await Promise.all(publications.map(async (publication) => {
      await this.publicationService.linkFaculty(publication.Id.toString(), analysisResults.facultyID.toString());
    }));

    // Link the publications with the associated FRP
    await Promise.all(publications.map(async (publication) => {
      await this.publicationService.linkFRP(publication.Id.toString(), analysisResults.frpID.toString());
    }));
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
