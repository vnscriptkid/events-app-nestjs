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

  public async getEvent(id: number): Promise<Event | undefined> {
    const query = this.getEventsWithAttendeesCountQuery().andWhere(
      'e.id = :id',
      { id },
    );

    this.logger.debug(`getEvent(${id}): ${query.getQuery()}`);

    return await query.getOne();
  }

  public getEventsWithAttendeesCountQuery() {
    return this.getEventsBaseQuery().loadRelationCountAndMap(
      'e.attendeesCount',
      'e.attendees',
    );
  }

  public async getEventWithAttendeesCount(
    id: number,
  ): Promise<Event | undefined> {
    // https://davidhamann.de/2017/07/11/sql-get-the-count-of-related-records/
    /* SUBQUERY */
    // const events = await this.eventRepository.query(
    //   `
    //   select
    //     *,
    //     (select count(*) from attendees a where a.event_id = ?) as attendeesCount
    //   from events e
    //   where e.id = ?;
    // `,
    //   [id, id],
    // );

    /* JOIN */
    const events = await this.eventRepository.query(
      `
      select
        e.*,
        count(a.id) as attendeesCount
      from events e
      left join attendees a on e.id = a.event_id
      where e.id = ?
      group by e.id
    `,
      [id],
    );

    return events[0];
  }
}
