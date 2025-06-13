/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('departments')
export class DepartmentController {
    private HR_SERVICE_URL = process.env.HR_SERVICE_URL || 'http://localhost:4002';

    constructor(private readonly httpService: HttpService) {}

    @Get()
    async getDepartments() {
        const response = await firstValueFrom(
            this.httpService.get(`${this.HR_SERVICE_URL}/departments`)
        );
        return response.data;
    }

    @Get(':id')
    async getDepartment(@Param('id') id: string) {
        const response = await firstValueFrom(
            this.httpService.get(`${this.HR_SERVICE_URL}/departments/${id}`)
        );
        return response.data;
    }

    @Post()
    async createDepartment(@Body() body: any) {
        const response = await firstValueFrom(
            this.httpService.post(`${this.HR_SERVICE_URL}/departments`, body)
        );
        return response.data;
    }

    @Put(':id')
    async updateDepartment(@Param('id') id: string, @Body() body: any) {
        const response = await firstValueFrom(
            this.httpService.put(`${this.HR_SERVICE_URL}/departments/${id}`, body)
        );
        return response.data;
    }

    @Delete(':id')
    async deleteDepartment(@Param('id') id: string) {
        const response = await firstValueFrom(
            this.httpService.delete(`${this.HR_SERVICE_URL}/departments/${id}`)
        );
        return response.data;
    }
}

