/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BenefitsService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_URL; // Use this consistently!

  constructor(private readonly httpService: HttpService) {}

  // ========== GLOBAL (ADMIN) BENEFITS ==========

  async findAll() {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/benefits`)
      .toPromise();
    return response?.data;
  }

  async findOne(id: number) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/benefits/${id}`)
      .toPromise();
    return response?.data;
  }

  async create(data: any) {
    const response = await this.httpService
      .post(`${this.hrServiceUrl}/benefits`, data)
      .toPromise();
    return response?.data;
  }

  async update(id: number, data: any) {
    const response = await this.httpService
      .patch(`${this.hrServiceUrl}/benefits/${id}`, data)
      .toPromise();
    return response?.data;
  }

  async remove(id: number) {
    const response = await this.httpService
      .delete(`${this.hrServiceUrl}/benefits/${id}`)
      .toPromise();
    return response?.data;
  }

  // ========== EMPLOYEE-CENTRIC BENEFITS ==========

  async getBenefitsByEmployee(employeeId: string) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/employees/${employeeId}/benefits`)
      .toPromise();
    return response?.data;
  }

  async createBenefitForEmployee(employeeId: string, body: any) {
    const response = await this.httpService
      .post(`${this.hrServiceUrl}/employees/${employeeId}/benefits`, body)
      .toPromise();
    return response?.data;
  }

  async getBenefitOfEmployee(employeeId: string, id: number) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/employees/${employeeId}/benefits/${id}`)
      .toPromise();
    return response?.data;
  }

  async updateBenefitOfEmployee(employeeId: string, id: number, body: any) {
    const response = await this.httpService
      .patch(`${this.hrServiceUrl}/employees/${employeeId}/benefits/${id}`, body)
      .toPromise();
    return response?.data;
  }

  async deleteBenefitOfEmployee(employeeId: string, id: number) {
    const response = await this.httpService
      .delete(`${this.hrServiceUrl}/employees/${employeeId}/benefits/${id}`)
      .toPromise();
    return response?.data;
  }
}
