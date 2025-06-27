/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DeductionsTypeService } from './deductions-type.service';
import { DeductionsTypeController } from './deductions-type.controller';
import { DeductionsService } from './deductions.service';
import { DeductionsController } from './deductions.controller';

@Module({
  imports: [HttpModule],
  controllers: [DeductionsTypeController, DeductionsController],
  providers: [DeductionsTypeService, DeductionsService],
})
export class DeductionsModule {}