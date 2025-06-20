import { Injectable } from '@nestjs/common';

@Injectable()
export class HrServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
