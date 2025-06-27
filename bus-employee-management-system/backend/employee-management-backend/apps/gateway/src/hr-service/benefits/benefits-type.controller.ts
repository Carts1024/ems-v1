/* eslint-disable prettier/prettier */
 
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
import { BenefitsTypeService } from './benefits-type.service';

@Controller('benefit/types')
export class BenefitsTypeController {
  constructor(private readonly benefitsTypeService: BenefitsTypeService) {}

  @Get()
  findAll() {
    return this.benefitsTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsTypeService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.benefitsTypeService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.benefitsTypeService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.benefitsTypeService.remove(id);
  }
}
