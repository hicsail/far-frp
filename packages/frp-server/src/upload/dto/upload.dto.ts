/*
 * The following DTOs are made based on the NocoDB documentation on
 * the webhook payload. The names are set by NocoDB
 */
import { IsObject, IsString, ValidateNested, IsNumber, IsArray, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class NocoDBFile {
  @IsString()
  title: string;

  @IsString()
  mimetype: string;

  @IsNumber()
  size: number;

  @IsString()
  path: string;

  @IsString()
  signedPath: string;
}

export class NocoDBInsertWebhookRow {
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

export class NocoDBInsertWebhookData {
  @IsString()
  table_id: string;

  @IsString()
  table_name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NocoDBInsertWebhookRow)
  rows: NocoDBInsertWebhookRow[];
}


export class NocoDBInsertWebhookPayload {
  @IsString()
  type: string;

  @IsString()
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => NocoDBInsertWebhookData)
  data: NocoDBInsertWebhookData;
}
