/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateGovernmentIdTypeDto } from './dto/create-government-id-type.dto';
import { UpdateGovernmentIdTypeDto } from './dto/update-government-id-type.dto';

@Injectable()
export class GovernmentIdTypeService {
  private readonly HR_SERVICE_URL =
    process.env.HR_SERVICE_URL || 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async create(dto: CreateGovernmentIdTypeDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.HR_SERVICE_URL}/government-id-type`, dto),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.HR_SERVICE_URL}/government-id-type`),
      );
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
        this.httpService.get(`${this.HR_SERVICE_URL}/government-id-type/${id}`),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async update(id: number, dto: UpdateGovernmentIdTypeDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.HR_SERVICE_URL}/government-id-type/${id}`,
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
        this.httpService.delete(
          `${this.HR_SERVICE_URL}/government-id-type/${id}`,
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
}
