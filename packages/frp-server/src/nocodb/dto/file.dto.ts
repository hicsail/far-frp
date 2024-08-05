import { IsString, IsNumber } from 'class-validator';

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
