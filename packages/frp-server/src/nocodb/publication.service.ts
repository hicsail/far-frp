import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { InjectNocoDB } from './nocodb.provider';

@Injectable()
export class PublicationService {

  constructor(
    @InjectNocoDB() private readonly nocodbService: Api<null>,
    private readonly configService: ConfigService
  ) {}
}
