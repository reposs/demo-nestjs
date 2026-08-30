import { Controller, Get } from '@nestjs/common';
import { BaseController } from '@/common/controllers/base.controller';

@Controller()
export class HealthController extends BaseController {
  loggerWhois(methodName: string) {
    this.logger.log(`${this.constructor.name}:${methodName}`);
  }

  @Get()
  check(): any {
    this.loggerWhois(this.check.name);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
