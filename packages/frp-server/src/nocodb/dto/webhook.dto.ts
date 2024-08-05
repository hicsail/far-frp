/*
 * The following DTOs are made based on the NocoDB documentation on
 * the webhook payload. The names are set by NocoDB
 */
import { IsObject, IsString, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';


export class NocoDBInsertWebhookData<T> {
  @IsString()
  table_id: string;

  @IsString()
  table_name: string;

  @IsArray()
  rows: T[];
}

export class NocoDBInsertWebhookPayload<T> {
  @IsString()
  type: string;

  @IsString()
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => NocoDBInsertWebhookData)
  data: NocoDBInsertWebhookData<T>;
}
