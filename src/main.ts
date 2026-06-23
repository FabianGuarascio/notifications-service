import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
        },
        consumer: {
          groupId: 'notifications-consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
