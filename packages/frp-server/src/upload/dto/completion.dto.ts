import { IsString, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class AnalysisResults {
  @IsString()
  title: string;

  @IsString()
  journal: string;

  @IsString()
  authors: string;

  @IsString()
  publicationDate: string;
}

export class AnalysisCompletion {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnalysisResults)
  /** The results from the matching process */
  results: AnalysisResults[];

  @IsString()
  facultyID: string;

  @IsString()
  frpID: string;
}
