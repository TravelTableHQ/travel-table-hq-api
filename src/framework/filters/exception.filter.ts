import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
  Logger,
} from '@nestjs/common';
import Table from 'cli-table';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let responseBody;

    const responseTable = new Table();

    responseTable.push({ Type: ' ==== RESPONSE ==== ' });
    responseTable.push({ method: req.method });
    responseTable.push({ url: req.originalUrl });
    responseTable.push({ status: httpStatus.toString() });

    if (httpStatus < 500) {
      responseBody = (exception as HttpException).getResponse();
      this.logger.log({
        level: 'info',
        message: `\n${responseTable.toString()}`,
      });
      this.logger.log({
        level: 'debug',
        message: `[data  ]:: ${JSON.stringify(responseBody)}`,
        length: 500,
      });
    } else {
      responseBody = (exception as Error).message;
      this.logger.error((exception as Error).stack!);
      this.logger.log({
        level: 'info',
        message: `\n${responseTable.toString()}`,
      });
    }

    res.status(httpStatus).json(responseBody);
  }
}
