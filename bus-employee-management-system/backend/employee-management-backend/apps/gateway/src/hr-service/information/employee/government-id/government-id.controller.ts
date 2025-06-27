import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { GovernmentIdService } from './government-id.service';
import { CreateGovernmentIdDto } from './dto/create-government-id.dto';
import { UpdateGovernmentIdDto } from './dto/update-government-id.dto';

@Controller('government-id')
export class GovernmentIdController {
  constructor(private readonly service: GovernmentIdService) {}

  @Post()
  create(@Body() dto: CreateGovernmentIdDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query('employeeId') employeeId?: string) {
    return this.service.findAll(employeeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGovernmentIdDto) {
    return this.service.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
