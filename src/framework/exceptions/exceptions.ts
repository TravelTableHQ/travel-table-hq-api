/* eslint-disable max-classes-per-file */
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorInfoInterface } from '../types/errorInterface';

export class BadRequestException extends HttpException {
  constructor(errorInfo: ErrorInfoInterface | string) {
    let response;

    if (typeof errorInfo === 'string') {
      response = {
        code: null,
        message: errorInfo,
      };
    } else {
      response = {
        code: errorInfo.code,
        message: errorInfo.message,
      };
    }

    super(response, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(errorInfo: ErrorInfoInterface | string) {
    super(
      typeof errorInfo === 'string' ? errorInfo : errorInfo.message,
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class NotFoundException extends HttpException {
  constructor(errorInfo: ErrorInfoInterface | string) {
    super(
      typeof errorInfo === 'string' ? errorInfo : errorInfo.message,
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UnSupportedMediaTypeException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
  }
}

export class InternalServerException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
