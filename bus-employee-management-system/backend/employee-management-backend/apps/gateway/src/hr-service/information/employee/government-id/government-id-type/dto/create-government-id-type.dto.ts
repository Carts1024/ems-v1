import { IsString, IsOptional } from 'class-validator';

export class CreateGovernmentIdTypeDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
