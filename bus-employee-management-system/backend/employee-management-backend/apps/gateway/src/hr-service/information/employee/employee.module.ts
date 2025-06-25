/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [HttpModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}