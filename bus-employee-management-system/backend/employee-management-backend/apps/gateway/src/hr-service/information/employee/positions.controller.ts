/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EmployeeService } from './employee.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.employeeService.proxyGet('/positions');
    return res.status(HttpStatus.OK).json(data);
  }

  @Post()
  async create(@Body() createPositionDto: any, @Res() res: Response) {
    const data = await this.employeeService.proxyPost(
      '/positions',
      createPositionDto,
    );
    return res.status(HttpStatus.CREATED).json(data);
  }
}
