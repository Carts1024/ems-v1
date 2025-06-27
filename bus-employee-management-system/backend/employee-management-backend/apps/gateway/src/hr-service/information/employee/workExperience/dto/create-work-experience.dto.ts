import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  employeeId: string;

  @IsString()
  companyName: string;

  @IsString()
  position: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
