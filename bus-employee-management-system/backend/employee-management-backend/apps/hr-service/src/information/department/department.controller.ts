/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  async getDepartments() {
    return this.departmentService.getAllDepartmentsWithCount();
  }

  @Post()
  async createDepartment(@Body() body: { departmentName: string }) {
    return this.departmentService.createDepartment(body.departmentName);
  }

  @Put(':id')
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { departmentName: string }
  ) {
    return this.departmentService.updateDepartment(id, body.departmentName);
  }

  @Delete(':id')
  async deleteDepartment(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.deleteDepartment(id);
  }
}
