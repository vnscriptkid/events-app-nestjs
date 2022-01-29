import { UpdateEventDto } from './dtos/update-event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEventDto } from './dtos/create-event.dto';
import { Event } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, MoreThan, Repository } from 'typeorm';

@Controller('events')
export class EventController {
  private events: Event[] = [];

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll() {
    return await this.eventRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventRepository.findOne(id);

    if (!event) throw new NotFoundException();

    return event;
  }

  @Post()
  async create(@Body() body: CreateEventDto) {
    const event = this.eventRepository.create({
      ...body,
      when: new Date(body.when),
    });

    return await this.eventRepository.save(event);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEventDto,
  ) {
    const event = await this.eventRepository.findOne(id);

    if (!event) throw new NotFoundException();

    Object.assign(event, {
      ...body,
      when: body.when ? new Date(body.when) : event.when,
    });

    return await this.eventRepository.save(event);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventRepository.findOne(id);

    if (!event) throw new NotFoundException();

    await this.eventRepository.remove(event);
  }

  /*
    select id, when
    from events
    where 
      (id > 3 and when > '2021-02-12T13:00:00')
      or description like '%meet%'
      order by id desc;
      limit 2
   */
  @Get('practice/complex')
  async practice() {
    return await this.eventRepository.find({
      select: ['id', 'when'],
      where: [
        // where X or Y
        {
          id: MoreThan(3),
          when: MoreThan(new Date('2021-02-12T13:00:00')),
        },
        {
          description: Like('%meet%'),
        },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    });
  }
}
