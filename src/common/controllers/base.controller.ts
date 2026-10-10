import { Logger } from '@nestjs/common';

export abstract class BaseController {
  protected readonly logger: Logger = new Logger(this.constructor.name);
}
