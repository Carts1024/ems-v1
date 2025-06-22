/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';


const HR_SERVICE_BASE_URL = process.env.HR_SERVICE_BASE_URL || 'http://192.168.43.53:4002';

@Injectable()
export class EmployeeService {
  constructor(private readonly httpService: HttpService) {}

  async proxyGet(path: string) {
    try {
      const res = await lastValueFrom(
        this.httpService.get(HR_SERVICE_BASE_URL + path),
      );
      return res.data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.response?.data || err.message,
      );
    }
  }

  async proxyPost(path: string, body: any) {
    try {
      const res = await lastValueFrom(
        this.httpService.post(HR_SERVICE_BASE_URL + path, body),
      );
      return res.data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.response?.data || err.message,
      );
    }
  }

  async proxyPut(path: string, body: any) {
    try {
      const res = await lastValueFrom(
        this.httpService.put(HR_SERVICE_BASE_URL + path, body),
      );
      return res.data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.response?.data || err.message,
      );
    }
  }

  async proxyDelete(path: string) {
    try {
      const res = await lastValueFrom(
        this.httpService.delete(HR_SERVICE_BASE_URL + path),
      );
      return res.data;
    } catch (err: any) {
      throw new InternalServerErrorException(
        err?.response?.data || err.message,
      );
    }
  }
}
