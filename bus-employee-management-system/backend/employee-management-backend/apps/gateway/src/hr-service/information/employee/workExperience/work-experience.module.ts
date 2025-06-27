import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WorkExperienceController } from './work-experience.controller';
import { WorkExperienceService } from './work-experience.service';

@Module({
  imports: [HttpModule],
  controllers: [WorkExperienceController],
  providers: [WorkExperienceService],
})
export class WorkExperienceModule {}
