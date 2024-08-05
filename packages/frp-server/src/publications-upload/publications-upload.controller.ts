import { Controller, Post, Body } from '@nestjs/common';
import { PublicationUploadWebhookPayload } from 'src/nocodb/dto/publication-upload.dto';
import { NocoDBInsertWebhookPayload } from '../nocodb/dto/webhook.dto';
import { PublicationsUploadService } from './publications-upload.service';
import { AnalysisCompletion } from './dto/completion.dto';

@Controller('publications')
export class PublicationsUploadController {
  constructor(private readonly publicationsUploadService: PublicationsUploadService) {}

  @Post('nocodbWebhook')
  async handleNocodbWebhook(
    @Body() payload: NocoDBInsertWebhookPayload<PublicationUploadWebhookPayload>
  ): Promise<void> {
    const publicationUploadID = payload.data.rows[0].Id.toString();
    const csvUrlStub = payload.data.rows[0].FAR[0].signedPath;

    await this.publicationsUploadService.handleUpload(publicationUploadID, csvUrlStub);
  }

  /**
   * When the analysis process has complete, this will handle completing
   * the analysis request.
   */
  @Post('complete')
  async handleAnalysisComplete(@Body() analysisPayload: AnalysisCompletion): Promise<void> {
    await this.publicationsUploadService.handleAnalysisCompletion(analysisPayload);
  }
}
