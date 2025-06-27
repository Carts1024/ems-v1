import { Test, TestingModule } from '@nestjs/testing';
import { HrServiceController } from './hr-service.controller';
import { HrServiceService } from './hr-service.service';

describe('HrServiceController', () => {
  let hrServiceController: HrServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HrServiceController],
      providers: [HrServiceService],
    }).compile();

    hrServiceController = app.get<HrServiceController>(HrServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(hrServiceController.getHello()).toBe('Hello World!');
    });
  });
});
