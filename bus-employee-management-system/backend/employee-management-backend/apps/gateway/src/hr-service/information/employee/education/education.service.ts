/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  private readonly HR_SERVICE_URL =
    process.env.HR_SERVICE_URL || 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async create(dto: CreateEducationDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.HR_SERVICE_URL}/education`, dto),
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
        ? `${this.HR_SERVICE_URL}/education?employeeId=${employeeId}`
        : `${this.HR_SERVICE_URL}/education`;
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
        this.httpService.get(`${this.HR_SERVICE_URL}/education/${id}`),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async update(id: number, dto: UpdateEducationDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.HR_SERVICE_URL}/education/${id}`, dto),
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
        this.httpService.delete(`${this.HR_SERVICE_URL}/education/${id}`),
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
