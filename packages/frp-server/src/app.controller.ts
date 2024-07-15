import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { KubeConfig, BatchV1Api, V1Job, V1ObjectMeta, V1JobSpec, V1PodSpec, V1PodTemplateSpec } from '@kubernetes/client-node';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello(): Promise<string> {
    const kc = new KubeConfig();
    kc.loadFromDefault();

    const metadata = new V1ObjectMeta();
    metadata.name = 'pi';

    const job = new V1Job();
    job.metadata = metadata;
    job.apiVersion = 'batch/v1';

    job.kind = 'Job';
    job.spec = new V1JobSpec();
    job.spec.template = new V1PodTemplateSpec();

    console.log(job.spec);

    job.spec.template.spec = new V1PodSpec();
    job.spec.template.spec.containers = [];

    job.spec!.template.spec!.containers.push({
      name: 'pi',
      image: 'perl:5.34.0',
      command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    });
    job.spec!.template.spec!.restartPolicy = 'Never';

    console.log(job);

    const batchV1Api = kc.makeApiClient(BatchV1Api);
    try {
      const createJobRes = await batchV1Api.createNamespacedJob('sail-24887a', job);
      console.log(createJobRes.body);
    } catch (e) {
      console.log(e);
    }

    return this.appService.getHello();
  }
}
