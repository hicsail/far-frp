import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { kubeProvider } from './kubectl.provider';

@Module({
  providers: [JobService, kubeProvider],
  exports: [JobService]
})
export class JobModule {}
