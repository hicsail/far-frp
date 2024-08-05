import { Body, Controller, Post } from '@nestjs/common';
import { GrantsUploadWebhookPayload } from '../nocodb/dto/grant-upload.dto';
import { NocoDBInsertWebhookPayload } from '../nocodb/dto/webhook.dto';

@Controller('grants-upload')
export class GrantsUploadController {

  @Post('nocodbWebhook')
  async handleNocodbWebhook(@Body() payload: NocoDBInsertWebhookPayload<GrantsUploadWebhookPayload>): Promise<void> {

  }
}
