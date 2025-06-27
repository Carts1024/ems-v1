/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DeductionsService } from './deductions.service';

@Controller()
export class DeductionsController {
  constructor(private readonly deductionsService: DeductionsService) {}

  // ===== Employee-centric endpoints =====

  // GET /employees/:employeeId/deductions
  @Get('employees/:employeeId/deductions')
  async getDeductionsByEmployee(@Param('employeeId') employeeId: string) {
    return this.deductionsService.getDeductionsByEmployee(employeeId);
  }

  // POST /employees/:employeeId/deductions
  @Post('employees/:employeeId/deductions')
  async createDeductionForEmployee(
    @Param('employeeId') employeeId: string,
    @Body() body: any,
  ) {
    return this.deductionsService.createDeductionForEmployee(employeeId, body);
  }

  // GET /employees/:employeeId/deductions/:id
  @Get('employees/:employeeId/deductions/:id')
  async getDeductionOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deductionsService.getDeductionOfEmployee(employeeId, id);
  }

  // PATCH /employees/:employeeId/deductions/:id
  @Patch('employees/:employeeId/deductions/:id')
  async updateDeductionOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.deductionsService.updateDeductionOfEmployee(employeeId, id, body);
  }

  // DELETE /employees/:employeeId/deductions/:id
  @Delete('employees/:employeeId/deductions/:id')
  async deleteDeductionOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.deductionsService.deleteDeductionOfEmployee(employeeId, id);
  }

  // ===== Global (admin) endpoints =====

  @Get('deductions')
  async findAll() {
    return this.deductionsService.findAll();
  }

  @Get('deductions/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deductionsService.findOne(id);
  }

  @Post('deductions')
  async create(@Body() data: any) {
    return this.deductionsService.create(data);
  }

  @Patch('deductions/:id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.deductionsService.update(id, data);
  }

  @Delete('deductions/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.deductionsService.remove(id);
  }
}
