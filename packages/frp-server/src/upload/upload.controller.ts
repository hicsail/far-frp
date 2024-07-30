import { Body, Controller, Post } from '@nestjs/common';
import { AnalysisCompletion } from './dto/completion.dto';
import { NocoDBInsertWebhookPayload } from './dto/upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('publications')
  async handlePublicationsWebhook(@Body() payload: NocoDBInsertWebhookPayload): Promise<void> {
    const targetFaculty = payload.data.rows[0].Faculty.toString();
    const csvUrlStub = payload.data.rows[0].FAR[0].signedPath;

    await this.uploadService.handleUpload(targetFaculty, csvUrlStub);
  }

  /**
   * When the analysis process has complete, this will handle completing
   * the analysis request.
   */
  @Post('complete')
  async handleAnalysisComplete(@Body() analysisPayload: AnalysisCompletion): Promise<void> {
    await this.uploadService.handleAnalysisCompletion(analysisPayload);
  }
}
