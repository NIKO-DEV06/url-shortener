import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from 'src/core/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { method, url } = req;
      const logData = {
        method,
        url,
      };
      const { statusCode } = res;
      if (statusCode >= 500) {
        this.logger.error(
          `OUTGOING RESPONSE: ${statusCode}: ${res.statusMessage}`,
          undefined,
          'HTTP',
          logData,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(
          `OUTGOING RESPONSE: ${statusCode}: ${res.statusMessage}`,
          'HTTP',
          logData,
        );
      } else {
        this.logger.log(
          `OUTGOING RESPONSE: ${statusCode}: ${res.statusMessage}`,
          'HTTP',
          logData,
        );
      }
    });
    next();
  }
}
