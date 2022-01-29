import { IsDateString, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'Name must be from 5 to 255 characters.' })
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  when: string;

  @IsString()
  address: string;
}
