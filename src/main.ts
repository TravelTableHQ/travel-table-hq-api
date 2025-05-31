import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './framework/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger();

  logger.log(`NODE_ENV=${process.env.NODE_ENV}`);
  logger.log(`MYSQL_USERNAME=${process.env.MYSQL_USERNAME}`);

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  try {
    const port = 3001;
    logger.debug(`PORT=${port}`);
    await app.listen(port);

    logger.log(`TravelTableHQ Server Listening at ${port}`);
  } catch (err) {
    logger.error(err.message);
  }
}

bootstrap();
