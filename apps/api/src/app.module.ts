import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASS = configService.get('RABBITMQ_PASS');
        const HOST = configService.get('RABBITMQ_HOST');
        const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
        console.log(USER, PASS, HOST, QUEUE);

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://admin:admin@localhost:5672`],
            noAck: false,
            queue: 'auth_queue',
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class AppModule {}
