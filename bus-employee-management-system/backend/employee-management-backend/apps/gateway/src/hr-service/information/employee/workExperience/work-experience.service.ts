/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CreateWorkExperienceDto } from './dto/create-work-experience.dto';
import { UpdateWorkExperienceDto } from './dto/update-work-experience.dto';

@Injectable()
export class WorkExperienceService {
  // Update this URL to your actual hr-service host (can use env vars)
  private readonly HR_SERVICE_URL =
    process.env.HR_SERVICE_URL || 'http://localhost:3001';

  constructor(private readonly httpService: HttpService) {}

  async create(dto: CreateWorkExperienceDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.HR_SERVICE_URL}/work-experience`, dto),
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
        ? `${this.HR_SERVICE_URL}/work-experience?employeeId=${employeeId}`
        : `${this.HR_SERVICE_URL}/work-experience`;
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
        this.httpService.get(`${this.HR_SERVICE_URL}/work-experience/${id}`),
      );
      return response.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'HR Service Error',
        err.response?.status || 500,
      );
    }
  }

  async update(id: number, dto: UpdateWorkExperienceDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.HR_SERVICE_URL}/work-experience/${id}`,
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
        this.httpService.delete(`${this.HR_SERVICE_URL}/work-experience/${id}`),
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
