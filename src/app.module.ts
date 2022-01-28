import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventController } from './event/event.controller';
import { Event } from './event/event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33066,
      username: 'root',
      password: '123456',
      database: 'nest-events',
      entities: [Event],
      synchronize: true,
    }),
  ],
  controllers: [AppController, EventController],
  providers: [AppService],
})
export class AppModule {}
