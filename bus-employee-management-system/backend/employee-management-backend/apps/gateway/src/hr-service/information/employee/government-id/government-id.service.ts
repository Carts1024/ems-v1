/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateGovernmentIdDto } from './dto/create-government-id.dto';
import { UpdateGovernmentIdDto } from './dto/update-government-id.dto';

@Injectable()
export class GovernmentIdService {
  private readonly HR_SERVICE_URL =
    process.env.HR_SERVICE_URL || 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async create(dto: CreateGovernmentIdDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.HR_SERVICE_URL}/government-id`, dto),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async findAll(employeeId?: string) {
    try {
      const url = employeeId
        ? `${this.HR_SERVICE_URL}/government-id?employeeId=${employeeId}`
        : `${this.HR_SERVICE_URL}/government-id`;
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async findOne(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.HR_SERVICE_URL}/government-id/${id}`),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async update(id: number, dto: UpdateGovernmentIdDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.HR_SERVICE_URL}/government-id/${id}`,
          dto,
        ),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async remove(id: number) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(`${this.HR_SERVICE_URL}/government-id/${id}`),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }
}
