import { PartialType } from '@nestjs/mapped-types';
import { CreateGovernmentIdDto } from './create-government-id.dto';

export class UpdateGovernmentIdDto extends PartialType(CreateGovernmentIdDto) {}
