import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const kc = new KubeConfig();
    kc.loadFromDefault();

    const k8sApi = kc.makeApiClient(CoreV1Api);
    const podsRes = await k8sApi.listNamespacedPod('sail-24887a');
    console.log(podsRes.body);

    return this.appService.getHello();
  }
}
