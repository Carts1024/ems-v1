/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PositionsService {
  private readonly hrServiceUrl = process.env.HR_SERVICE_BASE_URL;

  constructor(private readonly httpService: HttpService) {}

  findAll() {
    return this.httpService
      .get(`${this.hrServiceUrl}/positions`)
      .toPromise()
      .then((res) => res?.data)
      .catch((err) => {
        throw new InternalServerErrorException(
          err?.response?.data || err.message,
        );
      });
  }

  findOne(id: string) {
    return this.httpService
      .get(`${this.hrServiceUrl}/positions/${id}`)
      .toPromise()
      .then((res) => res?.data)
      .catch((err) => {
        throw new InternalServerErrorException(
          err?.response?.data || err.message,
        );
      });
  }

  create(data: any) {
    return this.httpService
      .post(`${this.hrServiceUrl}/positions`, data)
      .toPromise()
      .then((res) => res?.data)
      .catch((err) => {
        throw new InternalServerErrorException(
          err?.response?.data || err.message,
        );
      });
  }

  update(id: string, data: any) {
    return this.httpService
      .patch(`${this.hrServiceUrl}/positions/${id}`, data)
      .toPromise()
      .then((res) => res?.data)
      .catch((err) => {
        throw new InternalServerErrorException(
          err?.response?.data || err.message,
        );
      });
  }

  remove(id: string) {
    return this.httpService
      .delete(`${this.hrServiceUrl}/positions/${id}`)
      .toPromise()
      .then((res) => res?.data)
      .catch((err) => {
        throw new InternalServerErrorException(
          err?.response?.data || err.message,
        );
      });
  }
}
