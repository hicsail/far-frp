import { Body, Controller, Post, Get } from '@nestjs/common';
import { NocoDBInsertWebhookPayload } from './dto/upload.dto';
import { inspect } from 'util';

@Controller('upload')
export class UploadController {
  @Post('publications')
  async handlePublicationsWebhook(@Body() payload: NocoDBInsertWebhookPayload): Promise<string> {
    console.log(inspect(payload, {showHidden: false, depth: null, colors: true}))
    return 'ok';
  }

  @Get()
  hello() {
    return 'hello';
  }
}
