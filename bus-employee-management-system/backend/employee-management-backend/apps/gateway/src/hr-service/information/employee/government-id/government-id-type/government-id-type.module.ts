import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GovernmentIdTypeController } from './government-id-type.controller';
import { GovernmentIdTypeService } from './government-id-type.service';

@Module({
  imports: [HttpModule],
  controllers: [GovernmentIdTypeController],
  providers: [GovernmentIdTypeService],
})
export class GovernmentIdTypeModule {}
