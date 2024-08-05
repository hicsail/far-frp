import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Api } from 'nocodb-sdk';
import { Grant } from './dto/grant.dto';
import { InjectNocoDB } from './nocodb.provider';

@Injectable()
export class GrantsService {
  private readonly grantsTableID = this.configService.getOrThrow<string>('nocodb.grantsTableID');
  private readonly grantsToFacultyID = this.configService.getOrThrow<string>('nocodb.grantsToFacultyID');
  private readonly grantsToFRPID = this.configService.getOrThrow<string>('nocodb.grantsToFRPID');

  constructor(
    @InjectNocoDB() private readonly nocodbService: Api<null>,
    private readonly configService: ConfigService
  ) {}

  async findByTitle(title: string): Promise<Grant | null> {
    const matching = await this.nocodbService.dbDataTableRow.list(this.grantsTableID, {
      where: `(Title,eq,${title})`
    });

    return (matching.list.at(0) as Grant) || null;
  }

  async create(title: string, amount: number): Promise<Grant> {
    return await this.nocodbService.dbDataTableRow.create(this.grantsTableID, {
      Title: title,
      Amount: amount
    });
  }

  async linkFaculty(grantsID: string, facultyID: string): Promise<void> {
    await this.nocodbService.dbDataTableRow.nestedLink(
      this.grantsTableID,
      this.grantsToFacultyID,
      grantsID,
      {
        Id: facultyID
      }
    );
  }

  async linkFRP(grantsID: string, frpID: string): Promise<void> {
    await this.nocodbService.dbDataTableRow.nestedLink(
      this.grantsTableID,
      this.grantsToFRPID,
      grantsID,
      {
        Id: frpID
      }
    );
  }
}
