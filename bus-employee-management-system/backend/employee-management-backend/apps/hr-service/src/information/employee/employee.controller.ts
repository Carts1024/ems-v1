import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get('by-number/:employeeNumber')
  async getByEmployeeNumber(@Param('employeeNumber') employeeNumber: string) {
    const employee =
      await this.employeeService.findByEmployeeNumber(employeeNumber);
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  @Get(':id')
  async getEmployeeById(@Param('id') id: string) {
    const employee = await this.employeeService.findById(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }
}
