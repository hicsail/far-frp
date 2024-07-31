import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { NocoDBLink } from './dto/link.dto';
import { InjectNocoDB } from './nocodb.provider';
import { requestAll } from './utils/pagination';

@Injectable()
export class PublicationUploadService {
  private readonly publicationUploadTableID = this.configService.getOrThrow<string>('nocodb.publicationUploadTableID');
  private readonly publicationUploadToFacultyID = this.configService.getOrThrow<string>('nocodb.publicationUploadToFacultyID');

  constructor(
    @InjectNocoDB() private readonly nocoDBService: Api<null>,
    private readonly configService: ConfigService
  ) {}

  async getFacultyLinks(publicationUploadID: string): Promise<NocoDBLink[]> {
    return requestAll<NocoDBLink>((offset) => {
      return this.nocoDBService.dbDataTableRow.nestedList(this.publicationUploadTableID, this.publicationUploadToFacultyID, publicationUploadID, { offset });
    });
  }

  async makeComplete(publicationUploadID: string): Promise<void> {
    await this.nocoDBService.dbDataTableRow.update(this.publicationUploadTableID,
      { 'Id': publicationUploadID, 'Status': 'Complete' });
  }
}
