/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll() {
    return await this.employeeService.proxyGet('/employees');
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.employeeService.proxyGet(`/employees/${id}`);
    if (!data) throw new NotFoundException('Employee not found');
    return data;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeService.proxyPost(
      '/employees',
      createEmployeeDto,
    );
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    const updated = await this.employeeService.proxyPut(
      `/employees/${id}`,
      updateEmployeeDto,
    );
    if (!updated) throw new NotFoundException('Employee not found');
    return updated;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    const deleted = await this.employeeService.proxyDelete(`/employees/${id}`);
    if (!deleted) throw new NotFoundException('Employee not found');
    return deleted;
  }
}
