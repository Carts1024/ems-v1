/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FinanceEmpService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  // Get payroll employees for a single date
  async getEmployeesForPayroll(date: string) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/finance/payroll-employees`, {
        params: { date },
      })
      .toPromise();
    return response?.data;
  }

  // Get payroll employees for a date range
  async getEmployeesForPayrollRange(start: string, end: string) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/finance/payroll-employees-range`, {
        params: { start, end },
      })
      .toPromise();
    return response?.data;
  }
}
