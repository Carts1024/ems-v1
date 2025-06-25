/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class EmployeeService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  // Get all employees
  findAll() {
    return this.httpService
      .get(`${this.hrServiceUrl}/employees`)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }

  // Get single employee by id
  async findOne(id: string) {
    return this.httpService
      .get(`${this.hrServiceUrl}/employees/${id}`)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        if (err?.response?.status === 404) throw new NotFoundException('Employee not found');
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }
  async findByEmployeeNumber(employeeNumber: string) {
    return this.httpService
      .get(`${this.hrServiceUrl}/employees/by-number/${employeeNumber}`)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        if (err?.response?.status === 404) throw new NotFoundException('Employee not found');
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }
  // Create an employee
  create(data: any) {
    return this.httpService
      .post(`${this.hrServiceUrl}/employees`, data)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }

  // Update an employee
  update(id: string, data: any) {
    return this.httpService
      .put(`${this.hrServiceUrl}/employees/${id}`, data)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        if (err?.response?.status === 404) throw new NotFoundException('Employee not found');
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }

  // Delete an employee
  remove(id: string) {
    return this.httpService
      .delete(`${this.hrServiceUrl}/employees/${id}`)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        if (err?.response?.status === 404) throw new NotFoundException('Employee not found');
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }

  // Operations employees by role (custom HR service endpoint)
  async fetchForOperations(role: string) {
    const url = `${this.hrServiceUrl}/employees/ops`;
    const params = role ? { role } : {};
    return this.httpService
      .get(url, { params })
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }

  // Inventory endpoint
  async fetchInventory() {
    const url = `${this.hrServiceUrl}/employees/inv`;
    return this.httpService
      .get(url)
      .toPromise()
      .then(res => res?.data)
      .catch(err => {
        throw new InternalServerErrorException(err?.response?.data || err.message);
      });
  }

}
