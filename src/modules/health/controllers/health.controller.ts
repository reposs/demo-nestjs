import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from '@/common/controllers/base.controller';
import { HealthResponseDto } from '../dto/health-response.dto';

@Controller()
@ApiTags('health')
export class HealthController extends BaseController {
  loggerWhois(methodName: string): void {
    this.logger.log(`${this.constructor.name}:${methodName}`);
  }

  @Get(['', 'health'])
  @ApiOperation({ summary: 'Check API health status and uptime' })
  @ApiOkResponse({
    description: 'Service is healthy and running',
    type: HealthResponseDto,
  })
  check(): HealthResponseDto {
    this.loggerWhois(this.check.name);
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
