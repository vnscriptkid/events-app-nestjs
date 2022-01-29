import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // literal object into class instance of dto, convert params based to type annotation
      whitelist: true, // filter out any fields outside of dto
    }),
  );

  await app.listen(3000);
}
bootstrap();
