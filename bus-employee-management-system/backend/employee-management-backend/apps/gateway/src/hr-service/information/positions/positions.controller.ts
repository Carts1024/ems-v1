/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Res,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { PositionsService } from './positions.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.positionsService.findAll();
    return res.status(HttpStatus.OK).json(data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.positionsService.findOne(id);
    return res.status(HttpStatus.OK).json(data);
  }

  @Post()
  async create(@Body() createPositionDto: any, @Res() res: Response) {
    const data = await this.positionsService.create(createPositionDto);
    return res.status(HttpStatus.CREATED).json(data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePositionDto: any,
    @Res() res: Response,
  ) {
    const data = await this.positionsService.update(id, updatePositionDto);
    return res.status(HttpStatus.OK).json(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    const data = await this.positionsService.remove(id);
    return res.status(HttpStatus.OK).json(data);
  }
}
