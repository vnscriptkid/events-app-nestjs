import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  attendees: Attendee[];

  @AfterInsert()
  afterInsert() {
    console.log(`Event created #${this.id}`);
  }

  @AfterUpdate()
  afterUpdate() {
    console.log(`Event updated #${this.id}`);
  }

  @AfterRemove()
  afterRemove() {
    // No id inside `this`
    console.log(`Event removed #${JSON.stringify(this)}`);
  }
}
