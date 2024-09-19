import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { NocoDBLink } from './dto/link.dto';
import { InjectNocoDB } from './nocodb.provider';
import { requestAll } from './utils/pagination';

@Injectable()
export class GrantsUploadService {
  private readonly grantUploadTableID = this.configService.getOrThrow<string>('nocodb.grantUploadTableID');
  private readonly grantUploadToFacultyID = this.configService.getOrThrow<string>('nocodb.grantUploadToFacultyID');

  constructor(
    @InjectNocoDB() private readonly nocoDBService: Api<null>,
    private readonly configService: ConfigService
  ) {}

  async getFacultyLinks(grantUploadID: string): Promise<NocoDBLink[]> {
    return requestAll<NocoDBLink>((offset) => {
      return this.nocoDBService.dbDataTableRow.nestedList(
        this.grantUploadTableID,
        this.grantUploadToFacultyID,
        grantUploadID,
        { offset }
      );
    });
  }

  async makeComplete(grantUploadID: string): Promise<void> {
    await this.nocoDBService.dbDataTableRow.update(this.grantUploadTableID, {
      Id: parseInt(grantUploadID),
      Status: 'Complete'
    });
  }
}
