/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DeductionsService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  // ===== Employee-centric =====

  async getDeductionsByEmployee(employeeId: string) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/employees/${employeeId}/deductions`)
      .toPromise();
    return response?.data;
  }

  async createDeductionForEmployee(employeeId: string, body: any) {
    const response = await this.httpService
      .post(`${this.hrServiceUrl}/employees/${employeeId}/deductions`, body)
      .toPromise();
    return response?.data;
  }

  async getDeductionOfEmployee(employeeId: string, id: number) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/employees/${employeeId}/deductions/${id}`)
      .toPromise();
    return response?.data;
  }

  async updateDeductionOfEmployee(employeeId: string, id: number, body: any) {
    const response = await this.httpService
      .patch(
        `${this.hrServiceUrl}/employees/${employeeId}/deductions/${id}`,
        body,
      )
      .toPromise();
    return response?.data;
  }

  async deleteDeductionOfEmployee(employeeId: string, id: number) {
    const response = await this.httpService
      .delete(`${this.hrServiceUrl}/employees/${employeeId}/deductions/${id}`)
      .toPromise();
    return response?.data;
  }

  // ===== Global (admin) endpoints =====

  async findAll() {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/deductions`)
      .toPromise();
    return response?.data;
  }

  async findOne(id: number) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/deductions/${id}`)
      .toPromise();
    return response?.data;
  }

  async create(data: any) {
    const response = await this.httpService
      .post(`${this.hrServiceUrl}/deductions`, data)
      .toPromise();
    return response?.data;
  }

  async update(id: number, data: any) {
    const response = await this.httpService
      .patch(`${this.hrServiceUrl}/deductions/${id}`, data)
      .toPromise();
    return response?.data;
  }

  async remove(id: number) {
    const response = await this.httpService
      .delete(`${this.hrServiceUrl}/deductions/${id}`)
      .toPromise();
    return response?.data;
  }
}
