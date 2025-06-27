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
import { DeductionsTypeService } from './deductions-type.service';

@Controller('deduction/types')
export class DeductionsTypeController {
  constructor(private readonly deductionTypeService: DeductionsTypeService) {}

  @Get()
  findAll() {
    return this.deductionTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deductionTypeService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; description?: string }) {
    return this.deductionTypeService.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.deductionTypeService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deductionTypeService.remove(id);
  }
}
