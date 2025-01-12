import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  const USER = configService.get('RABBITMQ_USER');
  const PASS = configService.get('RABBITMQ_PASS');
  const HOST = configService.get('RABBITMQ_HOST');
  const PORT = configService.get('RABBITMQ_PORT') || 5672; // Default to 5672 if not set
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');

  // eslint-disable-next-line prettier/prettier
  console.log(`Connecting to RabbitMQ at amqp://admin:admin@localhost:5672`);
  console.log(`Using queue: ${QUEUE}`);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`Connecting to RabbitMQ at amqp://admin:admin@localhost:5672`],
      noAck: false,
      queue: 'auth_queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  await app.startAllMicroservices();
  // await app.listen(process.env.port ?? 3000);
}

bootstrap();
