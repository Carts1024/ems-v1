/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AttendanceService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_URL; // Use this consistently!

  constructor(private readonly httpService: HttpService) {}

  // ========== GLOBAL (ADMIN) ATTENDANCE ==========

  async findAll() {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/attendance`)
      .toPromise();
    return response?.data;
  }

  async findOne(id: number) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/attendance/${id}`)
      .toPromise();
    return response?.data;
  }

  async create(data: any) {
    const response = await this.httpService
      .post(`${this.hrServiceUrl}/attendance`, data)
      .toPromise();
    return response?.data;
  }

  async update(id: number, data: any) {
    const response = await this.httpService
      .put(`${this.hrServiceUrl}/attendance/${id}`, data)
      .toPromise();
    return response?.data;
  }

  async remove(id: number) {
    const response = await this.httpService
      .delete(`${this.hrServiceUrl}/attendance/${id}`)
      .toPromise();
    return response?.data;
  }

  // ========== EMPLOYEE-CENTRIC ATTENDANCE ==========

  async getAttendancesByEmployee(employeeId: string) {
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/attendance/employee/${employeeId}`)
      .toPromise();
    return response?.data;
  }

  async createAttendanceForEmployee(employeeId: string, body: any) {
    // If your HR-service uses `/attendance/employee/:employeeId` for create:
    const response = await this.httpService
      .post(`${this.hrServiceUrl}/attendance/employee/${employeeId}`, body)
      .toPromise();
    return response?.data;
  }

  // If you use `/employees/:employeeId/attendances` (RESTful, like benefits/deductions):
  // async createAttendanceForEmployee(employeeId: string, body: any) {
  //   const response = await this.httpService
  //     .post(`${this.hrServiceUrl}/employees/${employeeId}/attendances`, body)
  //     .toPromise();
  //   return response?.data;
  // }

  async getAttendanceOfEmployee(employeeId: string, id: number) {
    // If your HR-service uses this endpoint:
    const response = await this.httpService
      .get(`${this.hrServiceUrl}/attendance/employee/${employeeId}/${id}`)
      .toPromise();
    return response?.data;
  }

  async updateAttendanceOfEmployee(employeeId: string, id: number, body: any) {
    // Adjust to PATCH or PUT depending on your HR-service
    const response = await this.httpService
      .put(`${this.hrServiceUrl}/attendance/employee/${employeeId}/${id}`, body)
      .toPromise();
    return response?.data;
  }

  async deleteAttendanceOfEmployee(employeeId: string, id: number) {
    const response = await this.httpService
      .delete(`${this.hrServiceUrl}/attendance/employee/${employeeId}/${id}`)
      .toPromise();
    return response?.data;
  }
}
