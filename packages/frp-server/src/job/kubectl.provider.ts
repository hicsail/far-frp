import { KubeConfig } from '@kubernetes/client-node';
import { Inject, Provider } from '@nestjs/common';

const KUBE_PROVIDER = 'KUBE_PROVIDER';

export const InjectKube = () => Inject(KUBE_PROVIDER);

export const kubeProvider: Provider<KubeConfig> = {
  provide: KUBE_PROVIDER,
  useFactory: () => {
    const kube = new KubeConfig();
    kube.loadFromDefault();
    return kube;
  }
};
