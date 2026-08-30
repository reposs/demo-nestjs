import { Logger, Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';

@Module({
  controllers: [HealthController],
  providers: [Logger],
})
export class HealthModule {}
