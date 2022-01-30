import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
  ) {}

  private getEventsBaseQuery() {
    return this.eventRepository.createQueryBuilder('e').orderBy('e.id', 'DESC');
  }

  public async getEvent(id: number) {
    const query = this.getEventsBaseQuery().andWhere('e.id = :id', { id });

    this.logger.debug(`getEvent(${id}): ${query.getSql()}`);

    return await query.getOne();
  }
}
