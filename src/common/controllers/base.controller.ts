import { Inject, Logger } from '@nestjs/common';

export abstract class BaseController {
  @Inject(Logger)
  protected readonly logger!: Logger;
}
