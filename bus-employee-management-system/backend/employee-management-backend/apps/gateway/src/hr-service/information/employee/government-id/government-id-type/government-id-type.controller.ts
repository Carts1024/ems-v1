import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GovernmentIdTypeService } from './government-id-type.service';
import { CreateGovernmentIdTypeDto } from './dto/create-government-id-type.dto';
import { UpdateGovernmentIdTypeDto } from './dto/update-government-id-type.dto';

@Controller('government-id-type')
export class GovernmentIdTypeController {
  constructor(private readonly service: GovernmentIdTypeService) {}

  @Post()
  create(@Body() dto: CreateGovernmentIdTypeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGovernmentIdTypeDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
