import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import Table from 'cli-table';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    let requestTime = 0;

    const requestTable = new Table();

    requestTable.push({ Type: ' ==== REQUEST ==== ' });
    requestTable.push({ method: req.method });
    requestTable.push({ url: req.originalUrl });

    requestTime = Date.now();

    if (req.method === 'GET' && req.query) {
      requestTable.push({ query: JSON.stringify(req.query) });
    } else if (req.headers['content-type']) {
      requestTable.push({ 'content-type': req.headers['content-type'] });
      requestTable.push({ body: JSON.stringify(req.body) });
    }

    this.logger.log({ level: 'info', message: `\n${requestTable.toString()}` });

    res.on('finish', () => {
      const responseTable = new Table();

      const endTime = Date.now();

      responseTable.push({ Type: ' ==== RESPONSE ==== ' });
      responseTable.push({ method: req.method });
      responseTable.push({ url: req.originalUrl });
      responseTable.push({ status: res.statusCode.toString() });
      responseTable.push({ time: `${endTime - requestTime}ms` });

      this.logger.log({
        level: 'info',
        message: `\n${responseTable.toString()}`,
      });
    });

    next();
  }
}
