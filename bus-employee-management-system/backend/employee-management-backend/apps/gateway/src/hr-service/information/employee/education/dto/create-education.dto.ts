import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  employeeId: string;

  @IsOptional()
  @IsString()
  institution: string;

  @IsOptional()
  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  honors?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
