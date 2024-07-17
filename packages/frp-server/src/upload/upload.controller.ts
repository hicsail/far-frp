import { Body, Controller, Post } from '@nestjs/common';
import { NocoDBInsertWebhookPayload } from './dto/upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('publications')
  async handlePublicationsWebhook(@Body() payload: NocoDBInsertWebhookPayload): Promise<void> {
    const targetFaculty = payload.data.rows[0].Faculty.toString();

    await this.uploadService.handleUpload(targetFaculty);
  }
}
