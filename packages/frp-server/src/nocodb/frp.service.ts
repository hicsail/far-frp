import { Injectable } from '@nestjs/common';
import { InjectNocoDB } from './nocodb.provider';
import { Api } from 'nocodb-sdk';
import { ConfigService } from '@nestjs/config';
import { FRP } from './dto/frp.dto';

@Injectable()
export class FrpService {
  private readonly frpTableID = this.configService.getOrThrow<string>('nocodb.frpTableID');

  constructor(@InjectNocoDB() private readonly nocodb: Api<null>, private readonly configService: ConfigService) {}

  async getFRP(frpID: string): Promise<FRP> {
    return (await this.nocodb.dbDataTableRow.read(this.frpTableID, frpID)) as FRP;
  }
}
