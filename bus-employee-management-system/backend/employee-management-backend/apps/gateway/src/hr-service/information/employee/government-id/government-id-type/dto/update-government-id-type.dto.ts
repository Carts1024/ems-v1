import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernmentIdTypeDto } from './create-government-id-type.dto';

export class UpdateGovernmentIdTypeDto extends PartialType(
  CreateGovernmentIdTypeDto,
) {}
