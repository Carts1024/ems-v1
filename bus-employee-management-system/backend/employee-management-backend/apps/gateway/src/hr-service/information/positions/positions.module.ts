import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';

@Module({
  imports: [HttpModule],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
