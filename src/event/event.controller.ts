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
  create(@Body() body) {
    return `Create new event ${JSON.stringify(body)}`;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body) {
    return `Update event #${id} with ${JSON.stringify(body)}`;
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: number) {
    return `Delete event #${id}`;
  }
}
