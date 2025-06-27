import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GovernmentIdController } from './government-id.controller';
import { GovernmentIdService } from './government-id.service';
import { GovernmentIdTypeModule } from './government-id-type/government-id-type.module';

@Module({
  imports: [HttpModule, GovernmentIdTypeModule],
  controllers: [GovernmentIdController],
  providers: [GovernmentIdService],
})
export class GovernmentIdModule {}
