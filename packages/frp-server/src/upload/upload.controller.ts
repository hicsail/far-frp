import { Body, Controller, Post, Get } from '@nestjs/common';
import { NocoDBInsertWebhookPayload } from './dto/upload.dto';

@Controller('upload')
export class UploadController {
  @Post('publications')
  async handlePublicationsWebhook(@Body() payload: NocoDBInsertWebhookPayload): Promise<void> {

  }
}
