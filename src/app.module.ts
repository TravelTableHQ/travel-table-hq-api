import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      // load: [configuration],
      // ignoreEnvFile: process.env.NODE_ENV === "local" ? undefined : true,
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({
      useFactory: () => {
        const appName = 'travel-table-hq';
        console.log(process.env.NODE_ENV);
        // const logDir = process.env.NODE_ENV === "local" ? "logs" : "/data/logs/travel-table-hq";
        const logDir = 'logs';
        const logLevel = 'silly'; // info
        console.log('LOGGER_LEVEL', logLevel);

        const maxSize = '20m';
        const maxFiles = '14d';

        const consoleFormat = winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
          winston.format.splat(),
          winston.format.simple(),
          winston.format.printf((info: any) => {
            let message = info.message;

            message = `${info.timestamp} ${info.level} ${message}`;
            return message;
          }),
        );

        const fileFormat = winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:SSS' }),
          winston.format.splat(),
          winston.format.simple(),
          winston.format.printf((info) => {
            const message = `${info.timestamp} ${info.level} ${info.message}`;
            return message;
          }),
        );
        return {
          transports: [
            new winston.transports.Console({
              level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
              format: consoleFormat,
            }),
            new DailyRotateFile({
              level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
              filename: `${logDir}/${appName}_%DATE%.log`,
              datePattern: 'YYYY-MM-DD',
              format: fileFormat,
              maxSize,
              maxFiles,
            }),
            new DailyRotateFile({
              level: 'error',
              filename: `${logDir}/error-${appName}_%DATE%.log`,
              datePattern: 'YYYY-MM-DD',
              format: fileFormat,
              maxSize,
              maxFiles,
            }),
          ],
        };
      },
    }),
    // TypeORM 모듈
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): any => {
        return {
          type: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: 3306,
          // UTC 타임존으로 적용 / DB타임존이 로컬로 설정될 경우, 글로벌 서비스 여지 있는 경우 고난 발생 가능
          timezone: 'Z',
          username: configService.get('MYSQL_USERNAME'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DATABASE'),
          entities: [`${__dirname}/app/model/**/*.entity{.ts,.js}`],
          // true시, 위 entities 경로 내에서 발견된 모든 TypeORM 엔티티 클래스를 토대로 테이블 강제 생성 및 업데이트
          synchronize: true,
          logging: configService.get('TYPEORM_LOG_LEVEL').split(','),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
