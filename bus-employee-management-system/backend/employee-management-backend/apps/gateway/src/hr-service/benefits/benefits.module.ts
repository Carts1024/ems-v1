import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BenefitsTypeController } from './benefits-type.controller';
import { BenefitsTypeService } from './benefits-type.service';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';

@Module({
  imports: [HttpModule],
  controllers: [BenefitsTypeController, BenefitsController],
  providers: [BenefitsTypeService, BenefitsService],
})
export class BenefitsModule {}
