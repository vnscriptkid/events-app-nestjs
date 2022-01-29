import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Attendee } from 'src/event/attendee.entity';
import { Event } from '../event/event.entity';

export default (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  entities: [Event, Attendee],
});
