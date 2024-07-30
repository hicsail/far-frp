import { KubeConfig, V1Job, V1ObjectMeta, V1JobSpec, V1PodTemplateSpec, V1PodSpec, BatchV1Api } from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectKube } from './kubectl.provider';

@Injectable()
export class JobService {
  private readonly job = new V1Job();
  private readonly batchClient = this.kubeConfig.makeApiClient(BatchV1Api);
  private readonly namespace = this.configService.getOrThrow<string>('kube.namespace');

  constructor(@InjectKube() private readonly kubeConfig: KubeConfig, private readonly configService: ConfigService) {
    // Create a representation of the Kubernetes job ahead of time
    // TODO: In the future the job name should be based on the database ID from the specific fun
    const metadata = new V1ObjectMeta();
    metadata.name = 'frp-job';

    this.job.metadata = metadata;
    this.job.apiVersion = 'batch/v1';
    this.job.kind = 'Job';
    this.job.spec = new V1JobSpec();
    this.job.spec.ttlSecondsAfterFinished = 30;
    this.job.spec.template = new V1PodTemplateSpec();
    this.job.spec.template.spec = new V1PodSpec();
    this.job.spec.template.spec.containers = [];
    this.job.spec.template.spec.containers.push({
      name: 'frp-job',
      image: configService.getOrThrow<string>('kube.jobImage'),
      // NOTE: The command will be modified with the specific parameters later
      command: []
    });
    this.job.spec.template.spec.restartPolicy = 'Never';

  }

  async triggerJob(csvUrl: string, frpTitle: string, webhookUrl: string, webhookPayload: any): Promise<void> {
    const command = [
      'poetry',
      'run',
      'python',
      'frp_job/main.py',
      csvUrl,
      frpTitle,
      webhookUrl,
      JSON.stringify(webhookPayload)
    ];

    this.job.spec!.template.spec!.containers[0].command = command;

    // Kick off the job
    await this.batchClient.createNamespacedJob(this.namespace, this.job);
  }
}
