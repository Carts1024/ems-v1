import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  employeeNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

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
  @IsNotEmpty()
  barangay: string;

  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @IsNotEmpty()
  departmentId: number;

  @IsString()
  @IsOptional()
  employeeStatus?: string;
}
