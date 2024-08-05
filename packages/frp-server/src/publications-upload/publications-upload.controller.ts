import { Controller, Post, Body } from '@nestjs/common';
import { PublicationUploadWebhookPayload } from 'src/nocodb/dto/publication-upload.dto';
import { NocoDBInsertWebhookPayload } from '../nocodb/dto/webhook.dto';

@Controller('publications')
export class PublicationsUploadController {

  @Post('nocodbWebhook')
  async handleNocodbWebhook(@Body() payload: NocoDBInsertWebhookPayload<PublicationUploadWebhookPayload>): Promise<void> {
    const publicationUploadID = payload.data.rows[0].Id.toString();
    const csvUrlStub = payload.data.rows[0].FAR[0].signedPath;
  }
}
