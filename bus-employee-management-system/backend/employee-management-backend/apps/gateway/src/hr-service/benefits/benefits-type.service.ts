/* eslint-disable prettier/prettier */
 
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BenefitsTypeService {
  private readonly hrServiceUrl =
    process.env.HR_SERVICE_URL;

  constructor(private readonly httpService: HttpService) {}

  findAll() {
    return this.httpService
      .get(`${this.hrServiceUrl}/benefit/types`)
      .toPromise()
      .then((res) => res?.data);
  }

  findOne(id: number) {
    return this.httpService
      .get(`${this.hrServiceUrl}/benefit/types/${id}`)
      .toPromise()
      .then((res) => res?.data);
  }

  create(data: { name: string; description?: string }) {
    return this.httpService
      .post(`${this.hrServiceUrl}/benefit/types`, data)
      .toPromise()
      .then((res) => res?.data);
  }

  update(id: number, data: { name?: string; description?: string }) {
    return this.httpService
      .patch(`${this.hrServiceUrl}/benefit/types/${id}`, data)
      .toPromise()
      .then((res) => res?.data);
  }

  remove(id: number) {
    return this.httpService
      .delete(`${this.hrServiceUrl}/benefit/types/${id}`)
      .toPromise()
      .then((res) => res?.data);
  }
}
