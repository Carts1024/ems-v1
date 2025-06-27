import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsInt,
  IsNumber,
  IsArray,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateGovernmentIdDto } from '../government-id/dto/create-government-id.dto';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  suffix?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsDateString()
  @IsNotEmpty()
  birthdate: string;

  @IsDateString()
  @IsNotEmpty()
  hiredate: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsOptional()
  streetAddress?: string;

  @IsString()
  @IsNotEmpty()
  barangay: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  province: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  emergencyContactNo?: string;

  @IsDecimal()
  @IsOptional()
  basicRate?: number | string;

  @IsString()
  @IsOptional()
  licenseType?: string;

  @IsString()
  @IsOptional()
  licenseNo?: string;

  @IsArray()
  @IsOptional()
  restrictionCodes?: string[];

  @IsDateString()
  @IsOptional()
  expireDate?: string;

  @IsString()
  @IsOptional()
  employeeStatus?: string; // default: 'active'

  @IsString()
  @IsOptional()
  employeeType?: string; // default: 'regular'

  @IsString()
  @IsOptional()
  employeeClassification?: string;

  @IsDateString()
  @IsOptional()
  terminationDate?: string;

  @IsString()
  @IsOptional()
  terminationReason?: string;

  @IsInt()
  @IsNotEmpty()
  positionId: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGovernmentIdDto)
  governmentIDs?: CreateGovernmentIdDto[];
}
