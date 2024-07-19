import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { Publication } from './dto/publication.dto';
import { InjectNocoDB } from './nocodb.provider';

@Injectable()
export class PublicationService {
  private readonly publicationTableID = this.configService.getOrThrow<string>('nocodb.publicationTableID');

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
    return this.nocodbService.dbDataTableRow.create(this.publicationTableID, {
      'Title': title,
      'Journal': journal,
      'Publication Date': publicationDate
    });
  }
}
