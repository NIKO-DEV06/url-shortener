import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as wiston from 'winston';

@Injectable()
export class LoggerService implements NestLogger {
  private logger: wiston.Logger;
  constructor(private readonly configService: ConfigService) {
    const isDevelopment =
      this.configService.get<string>('environment') === 'development';

    this.logger = isDevelopment
      ? wiston.createLogger({
          format: wiston.format.combine(
            wiston.format.colorize(),
            wiston.format.timestamp(),
            wiston.format.json(),

            wiston.format.printf(
              ({ timestamp, level, message, context, meta }) => {
                return `${timestamp} [${level}] [${context}] ${message} ${meta ? JSON.stringify(meta) : ''}`;
              },
            ),
          ),
          transports: [new wiston.transports.Console()],
        })
      : wiston.createLogger({
          format: wiston.format.combine(
            wiston.format.timestamp(),
            wiston.format.json(),
          ),
          transports: [new wiston.transports.Console()],
        });
  }
  log(message: string, context?: string, meta?: any) {
    this.logger.info(message, { context, meta });
  }

  error(message: string, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { context, trace, meta });
  }

  warn(message: string, context?: string, meta?: any) {
    this.logger.warn(message, { context, meta });
  }
}
