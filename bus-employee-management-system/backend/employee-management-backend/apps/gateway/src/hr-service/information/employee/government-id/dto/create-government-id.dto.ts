import { IsString, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateGovernmentIdDto {
  @IsString()
  employeeId: string;

  @IsString()
  type: string;

  @IsString()
  idNumber: string;

  @IsOptional()
  @IsDateString()
  issuedDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
