import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { KubeConfig, BatchV1Api } from '@kubernetes/client-node';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const kc = new KubeConfig();
    kc.loadFromDefault();

    const batchV1beta1Api = kc.makeApiClient(BatchV1Api);
    const jobs = await batchV1beta1Api.listNamespacedJob('sail-24887a');

    console.log(jobs.body);

    return this.appService.getHello();
  }
}
