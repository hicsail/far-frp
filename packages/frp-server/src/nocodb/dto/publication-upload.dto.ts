import { IsNumber, IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NocoDBFile } from './file.dto';


export class PublicationUploadWebhookPayload {
  @IsNumber()
  Id: number;

  @IsString()
  @IsOptional()
  Title: string;

  @IsString()
  CreatedAt: string;

  @IsString()
  @IsOptional()
  UpdatedAt: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NocoDBFile)
  FAR: NocoDBFile[];

  @IsNumber()
  Faculty: number;

  @IsString()
  Status: string;
}
