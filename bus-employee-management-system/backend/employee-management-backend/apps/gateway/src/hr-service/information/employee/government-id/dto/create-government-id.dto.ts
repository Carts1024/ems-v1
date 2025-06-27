import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateGovernmentIdDto {
  @IsNumber()
  typeId: number;

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
