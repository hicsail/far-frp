import { Inject, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';

const NOCODB_PROVIDER = 'NOCODB_PROVIDER';

export const InjectNocoDB = () => Inject(NOCODB_PROVIDER);

export const nocodbProvider: Provider<Api<null>> = {
  provide: NOCODB_PROVIDER,
  useFactory: (configService: ConfigService) => {
    const baseURL = configService.getOrThrow<string>('nocodb.baseUri');
    const token = configService.getOrThrow<string>('nocodb.token');

    return new Api({
      baseURL,
      headers: {
        'xc-token': token
      }
    });
  },
  inject: [ConfigService]
};
