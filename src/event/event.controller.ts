import { UpdateEventDto } from './dtos/update-event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { Event } from './event.entity';

@Controller('events')
export class EventController {
  private events: Event[] = [];

  @Get()
  findAll() {
    return this.events;
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.events.find((e) => e.id === +id);
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    const event = {
      ...body,
      id: this.events.length + 1,
      when: new Date(body.when),
    };

    this.events.push(event);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateEventDto) {
    const eventIdx = this.events.findIndex((e) => e.id === +id);

    if (eventIdx === -1) throw new NotFoundException();

    const event = this.events[eventIdx];

    this.events[eventIdx] = {
      ...event,
      ...body,
      when: body.when ? new Date(body.when) : event.when,
    };
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    this.events = this.events.filter((e) => e.id !== +id);
  }
}
