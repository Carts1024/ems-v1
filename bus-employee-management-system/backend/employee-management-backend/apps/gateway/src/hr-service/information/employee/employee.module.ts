/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { PositionsController } from './positions.controller';

@Module({
  imports: [HttpModule],
  controllers: [EmployeeController,PositionsController],
  providers: [EmployeeService],
})
export class EmployeeModule {}