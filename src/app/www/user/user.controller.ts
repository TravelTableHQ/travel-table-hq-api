import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('/user')
export class UserController {
  @Get('/')
  async reqByQueryString(@Query('name') name: string) {
    return `Hello ${name} ByQueryString`;
  }

  @Get('/:name')
  async reqByPathVariable(@Param('name') name: string) {
    return `Hello ${name} ByPathVariable`;
  }
}
