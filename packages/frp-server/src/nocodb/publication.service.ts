import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { Publication } from './dto/publication.dto';
import { InjectNocoDB } from './nocodb.provider';

@Injectable()
export class PublicationService {
  private readonly publicationTableID = this.configService.getOrThrow<string>('nocodb.publicationTableID');
  private readonly publicationToFacultyID = this.configService.getOrThrow<string>('nocodb.publicationToFacultyID');
  private readonly publicationToFRPID = this.configService.getOrThrow<string>('nocodb.publicationToFRPID');

  constructor(
    @InjectNocoDB() private readonly nocodbService: Api<null>,
    private readonly configService: ConfigService
  ) {}

  async findByTitle(title: string): Promise<Publication | null> {
    const matching = await this.nocodbService.dbDataTableRow.list(this.publicationTableID, {
      where: `(Title,eq,${title})`
    });

    return matching.list.at(0) as Publication || null;
  }

  async create(title: string, journal: string, publicationDate: string): Promise<Publication> {
    return await this.nocodbService.dbDataTableRow.create(this.publicationTableID, {
      'Title': title,
      'Journal': journal,
      'Publication Date': publicationDate
    });
  }

  async linkFaculty(publicationID: string, facultyID: string): Promise<void> {
    await this.nocodbService.dbDataTableRow.nestedLink(this.publicationTableID, this.publicationToFacultyID, publicationID, {
      Id: facultyID
    });
  }

  async linkFRP(publicationID: string, frpID: string): Promise<void> {
    await this.nocodbService.dbDataTableRow.nestedLink(this.publicationTableID, this.publicationToFRPID, publicationID, {
      Id: frpID
    });
  }
}
