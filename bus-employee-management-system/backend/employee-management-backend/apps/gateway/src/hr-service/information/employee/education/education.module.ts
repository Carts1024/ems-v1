import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EducationController } from './education.controller';
import { EducationService } from './education.service';

@Module({
  imports: [HttpModule],
  controllers: [EducationController],
  providers: [EducationService],
})
export class EducationModule {}
