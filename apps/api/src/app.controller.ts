import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(@Inject('AUTH_SERVICE') private AuthService: ClientProxy) {}

  @Get()
  async foo() {
    return { foo: 'bar' };
  }

  @Get('/auth')
  async getUser() {
    return this.AuthService.send(
      {
        cmd: 'get-users',
      },
      {},
    );
  }
}
