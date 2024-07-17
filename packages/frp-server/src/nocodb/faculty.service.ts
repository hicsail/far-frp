import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { NocoDBLink } from './dto/link.dto';
import { InjectNocoDB } from './nocodb.provider';
import { requestAll } from './utils/pagination';


@Injectable()
export class FacultyService {
  private readonly facultyTableID = this.configService.getOrThrow<string>('nocodb.facultyTableID');
  private readonly facultyToFrpID = this.configService.getOrThrow<string>('nocodb.facultyToFrpID');

  constructor(
    @InjectNocoDB() private readonly nocoDBService: Api<null>,
    private readonly configService: ConfigService
  ) {}


  async getFRPLinks(facultyID: string): Promise<NocoDBLink[]> {
    return requestAll<NocoDBLink>((offset) => {
      return this.nocoDBService.dbDataTableRow.nestedList(this.facultyTableID, this.facultyToFrpID, facultyID, { offset });
    });
  }

}
