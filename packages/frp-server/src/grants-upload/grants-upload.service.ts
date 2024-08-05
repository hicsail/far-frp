import { Injectable } from '@nestjs/common';
import { FrpService } from '../nocodb/frp.service';
import { FacultyService } from '../nocodb/faculty.service';
import { GrantsService } from '../nocodb/grants.service';
import { JobService } from '../job/job.service';
import { ConfigService } from '@nestjs/config';
import { AnalysisCompletion } from './dto/completion.dto';
import { GrantsUploadService as NocoDBGrants } from '../nocodb/grants-upload.service';
import { Grant } from '../nocodb/dto/grant.dto';

@Injectable()
export class GrantsUploadService {
  private readonly backendUrl = this.configService.getOrThrow<string>('server.url');
  private readonly nocodbBaseUrl = this.configService.getOrThrow<string>('nocodb.baseUri');

  constructor(
    private readonly facultyService: FacultyService,
    private readonly frpService: FrpService,
    private readonly grantsService: GrantsService,
    private readonly jobService: JobService,
    private readonly configService: ConfigService,
    private readonly grantsUploadService: NocoDBGrants
  ) {}

  async handleUpload(grantsUploadID: string, csvUrlStub: string) {
    // Get the faculty associated with the publication upload
    // NOTE: only one faculty is allowed per upload
    const facultyID = (await this.grantsUploadService.getFacultyLinks(grantsUploadID))[0].Id.toString();

    // Get the FRP's associated with the faculty
    const frpIDs = (await this.facultyService.getFRPLinks(facultyID)).map((frp) => frp.Id);
    const frps = await Promise.all(frpIDs.map((frpID) => this.frpService.getFRP(frpID.toString())));

    // TODO: In the future this information will be stored in a seperate DB and ID of
    // that entry will be shared with the job

    // Start the jobs
    for (const frp of frps) {
      console.log(frp);
      /*
      await this.jobService.triggerJob(
        `${this.nocodbBaseUrl}/${csvUrlStub}`,
        frp.Title,
        frp.Year.toString(),
        `${this.backendUrl}/upload/complete`,
        {
          facultyID: facultyID.toString(),
          frpID: frp.Id.toString(),
          uploadID: publicationUploadID.toString()
        }
      ); */
    }
  }

  async handleAnalysisCompletion(analysisResults: AnalysisCompletion): Promise<void> {
    console.log(analysisResults);
    // Get all publications from the matching
    const publications = await this.getOrCreatePublications(analysisResults);

    // Link the publications with the associated faculty
    await Promise.all(
      publications.map(async (publication) => {
        await this.grantsService.linkFaculty(publication.Id.toString(), analysisResults.facultyID.toString());
      })
    );

    // Link the publications with the associated FRP
    await Promise.all(
      publications.map(async (publication) => {
        await this.grantsService.linkFRP(publication.Id.toString(), analysisResults.frpID.toString());
      })
    );

    // Make the upload as complete
    await this.grantsUploadService.makeComplete(analysisResults.uploadID);
  }

  /**
   * Will loop over all the publications from the analysis and either create new ones if they
   * don't exist or return the existing ones
   */
  private async getOrCreatePublications(analysisResults: AnalysisCompletion): Promise<Grant[]> {
    return Promise.all(
      analysisResults.results.map(async (match) => {
        const existing = await this.grantsService.findByTitle(match.title);
        if (existing) {
          return existing;
        }
        return this.grantsService.create(match.title, match.amount);
      })
    );
  }
}
