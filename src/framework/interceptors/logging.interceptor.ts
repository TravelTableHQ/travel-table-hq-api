import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'; // import Table from "cli-table";
// import { Request, Response } from "express";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Table from 'cli-table';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    const req = context.switchToHttp().getRequest<Request>();
    const logger = new Logger();

    const requestTable = new Table();

    requestTable.push({ Type: ' ==== REQUEST ==== ' });
    requestTable.push({ method: req.method });
    requestTable.push({ url: req.originalUrl });

    const requestTime = Date.now();

    if (req.method === 'GET' && req.query) {
      requestTable.push({ query: JSON.stringify(req.query) });
    } else if (req.headers['content-type']) {
      requestTable.push({ 'content-type': req.headers['content-type'] });
      requestTable.push({ body: JSON.stringify(req.body) });
    }

    logger.log(`\n${requestTable.toString()}`);

    return next.handle().pipe(
      tap((data) => {
        const responseTable = new Table();

        const endTime = Date.now();

        responseTable.push({ Type: ' ==== RESPONSE ==== ' });
        responseTable.push({ method: req.method });
        responseTable.push({ url: req.originalUrl });
        responseTable.push({ status: res.statusCode.toString() });
        responseTable.push({ time: `${endTime - requestTime}ms` });

        logger.log(`\n${responseTable.toString()}`);

        if (data !== undefined && data !== null) {
          logger.log({
            level: 'debug',
            message: `[data  ]:: ${JSON.stringify(data)}`,
            length: 500,
          });
        }
      }),
    );
  }
}
