import { UpdateEventDto } from './dtos/update-event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';

@Controller('events')
export class EventController {
  @Get()
  findAll() {
    return [];
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return `Get event #${id}`;
  }

  @Post()
  create(@Body() body: CreateEventDto) {
    return `Create new event ${JSON.stringify(body)}`;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateEventDto) {
    return `Update event #${id} with ${JSON.stringify(body)}`;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return `Delete event #${id}`;
  }
}
