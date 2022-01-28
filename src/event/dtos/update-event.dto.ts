import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
// export class UpdateEventDto {
//   name?: string;

//   description?: string;

//   when?: string;

//   address?: string;
// }

export class UpdateEventDto extends PartialType(CreateEventDto) {}
