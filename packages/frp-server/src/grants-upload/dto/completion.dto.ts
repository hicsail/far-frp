import { IsString, ValidateNested, IsArray, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AnalysisResults {
  @IsString()
  title: string;

  @IsNumber()
  amount: number;
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

  @IsString()
  uploadID: string;
}
