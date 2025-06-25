/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { FinanceEmpService } from './finance-emp.service';

@Controller('finance')
export class FinanceEmpController {
  constructor(private readonly financeEmpService: FinanceEmpService) {}

  // Get payroll employees for a specific date
  @Get('payroll-employees')
  async getEmployeesForPayroll(@Query('date') date: string) {
    if (!date) {
      throw new BadRequestException('Missing date query parameter');
    }
    return this.financeEmpService.getEmployeesForPayroll(date);
  }

  // Get payroll employees for a date range
  @Get('payroll-employees-range')
  async getEmployeesForPayrollRange(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    if (!start || !end) {
      throw new BadRequestException(
        'Missing start or end date query parameters',
      );
    }
    return this.financeEmpService.getEmployeesForPayrollRange(start, end);
  }
}
