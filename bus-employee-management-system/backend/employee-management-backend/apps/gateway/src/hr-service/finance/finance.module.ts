/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FinanceEmpController } from './finance-emp.controller';
import { FinanceEmpService } from './finance-emp.service';

@Module({
  imports: [HttpModule],
  controllers: [FinanceEmpController],
  providers: [FinanceEmpService],
})
export class FinanceEmpModule {}