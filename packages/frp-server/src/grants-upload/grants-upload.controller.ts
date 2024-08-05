import { Body, Controller, Post } from '@nestjs/common';
import { GrantsUploadWebhookPayload } from '../nocodb/dto/grant-upload.dto';
import { NocoDBInsertWebhookPayload } from '../nocodb/dto/webhook.dto';
import { GrantsUploadService } from './grants-upload.service';

@Controller('grants')
export class GrantsUploadController {

  constructor(private readonly grantsUploadService: GrantsUploadService) {}

  @Post('nocodbWebhook')
  async handleNocodbWebhook(@Body() payload: NocoDBInsertWebhookPayload<GrantsUploadWebhookPayload>): Promise<void> {
    const grantsUploadID = payload.data.rows[0].Id.toString();
    const csvUrlStub = payload.data.rows[0].FAR[0].signedPath;

    await this.grantsUploadService.handleUpload(grantsUploadID, csvUrlStub);
  }


}
