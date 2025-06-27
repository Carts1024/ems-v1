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
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { BenefitsService } from './benefits.service';

@Controller()
export class BenefitsController {
  constructor(private readonly benefitsService: BenefitsService) {}

  @Get('benefits')
  findAll() {
    return this.benefitsService.findAll();
  }

  @Get('benefits/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsService.findOne(id);
  }

  @Post('benefits')
  create(@Body() body: any) {
    return this.benefitsService.create(body);
  }

  @Patch('benefits:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.benefitsService.update(id, body);
  }

  @Delete('benefits/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsService.remove(id);
  }

  // Employee-centric benefit endpoints

  // GET /employees/:employeeId/benefits
  @Get('employees/:employeeId/benefits')
  async getBenefitsByEmployee(@Param('employeeId') employeeId: string) {
    return this.benefitsService.getBenefitsByEmployee(employeeId);
  }

  // POST /employees/:employeeId/benefits
  @Post('employees/:employeeId/benefits')
  async createBenefitForEmployee(
    @Param('employeeId') employeeId: string,
    @Body() body: any,
  ) {
    return this.benefitsService.createBenefitForEmployee(employeeId, body);
  }

  // GET /employees/:employeeId/benefits/:id
  @Get('employees/:employeeId/benefits/:id')
  async getBenefitOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.benefitsService.getBenefitOfEmployee(employeeId, id);
  }

  // PATCH /employees/:employeeId/benefits/:id
  @Patch('employees/:employeeId/benefits/:id')
  async updateBenefitOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: any,
  ) {
    return this.benefitsService.updateBenefitOfEmployee(employeeId, id, body);
  }

  // DELETE /employees/:employeeId/benefits/:id
  @Delete('employees/:employeeId/benefits/:id')
  async deleteBenefitOfEmployee(
    @Param('employeeId') employeeId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.benefitsService.deleteBenefitOfEmployee(employeeId, id);
  }
}
