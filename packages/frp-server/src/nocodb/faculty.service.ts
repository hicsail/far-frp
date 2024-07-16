import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NocoDBLink } from './dto/link.dto';

@Injectable()
export class FacultyService {
  private readonly baseUri = this.configService.getOrThrow<string>('nocodb.baseUri');
  private readonly facultyTableID = this.configService.getOrThrow<string>('nocodb.facultyTableID');
  private readonly facultyToFrpID = this.configService.getOrThrow<string>('nocodb.facultyToFrpID');


  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}


  async getFRPLinks(facultyID: number): Promise<NocoDBLink[]> {
    const requestURL = `${this.baseUri}/api/v2/tables/${this.facultyTableID}/links/${facultyID}/records/${facultyID}`;

    return [];
  }

}
