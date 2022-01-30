import { UpdateEventDto } from './dtos/update-event.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
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
import { Attendee } from './attendee.entity';
import { EventService } from './event.service';

@Controller('events')
export class EventController {
  // creating a brand new instance for every service is a good practice and allows us to supply the name of the service for the Logger constructor
  private readonly logger = new Logger(EventController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventService: EventService,
  ) {}

  @Get()
  async findAll() {
    this.logger.log(`Hit ${EventController.name}:findAll()`);
    const events = await this.eventRepository.find({
      relations: ['attendees'],
    });
    this.logger.debug(
      `Returned ${events.length} events from ${EventController.name}:findAll()`,
    );
    return events;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const event = await this.eventService.getEvent(id);

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
  async update(@Param('id') id: number, @Body() body: UpdateEventDto) {
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

  @Post('practice/add-attendee')
  async addAttendee() {
    const event = await this.eventRepository.findOne(1, {
      relations: ['attendees'],
    });

    const attendee = await this.attendeeRepository.findOne(1);

    event.attendees.push(attendee);

    await this.eventRepository.save(event);

    return await this.eventRepository.findOne(1, { relations: ['attendees'] });
  }

  @Post('practice/remove-attendee')
  async removeAttendee() {
    const event = await this.eventRepository.findOne(1, {
      relations: ['attendees'],
    });

    const attendee = await this.attendeeRepository.findOne(1);

    event.attendees = event.attendees.filter((a) => a.id !== attendee.id);

    await this.eventRepository.save(event);

    return await this.eventRepository.findOne(1, { relations: ['attendees'] });
  }
}
