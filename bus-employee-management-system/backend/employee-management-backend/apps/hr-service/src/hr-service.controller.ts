import { Controller, Get } from '@nestjs/common';
import { HrServiceService } from './hr-service.service';

@Controller()
export class HrServiceController {
  constructor(private readonly hrServiceService: HrServiceService) {}

  @Get()
  getHello(): string {
    return this.hrServiceService.getHello();
  }
}
