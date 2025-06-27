/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class DeductionsTypeService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  findAll() {
    return this.httpService.get(`${this.hrServiceUrl}/deduction/types`).toPromise().then(res => res?.data);
  }

  findOne(id: number) {
    return this.httpService.get(`${this.hrServiceUrl}/deduction/types/${id}`).toPromise().then(res => res?.data);
  }

  create(data: { name: string; description?: string }) {
    return this.httpService.post(`${this.hrServiceUrl}/deduction/types`, data).toPromise().then(res => res?.data);
  }

  update(id: number, data: { name?: string; description?: string }) {
    return this.httpService.patch(`${this.hrServiceUrl}/deduction/types/${id}`, data).toPromise().then(res => res?.data);
  }

  remove(id: number) {
    return this.httpService.delete(`${this.hrServiceUrl}/deduction/types/${id}`).toPromise().then(res => res?.data);
  }
}
