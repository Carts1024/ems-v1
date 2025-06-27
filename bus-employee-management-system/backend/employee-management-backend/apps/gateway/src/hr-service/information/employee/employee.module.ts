/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { WorkExperienceModule } from './workExperience/work-experience.module';
import { GovernmentIdModule } from './government-id/government-id.module';  
import { EducationModule } from './education/education.module';

@Module({
  imports: [HttpModule, WorkExperienceModule, GovernmentIdModule, EducationModule],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}