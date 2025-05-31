import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { BadRequestException } from '../exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'custom') {
      if (!value) {
        throw new BadRequestException('No data submitted');
      }

      const { metatype } = metadata;
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }

      const object = plainToInstance(metatype, value);
      await validate(object).then((error) => {
        if (error.length !== 0) {
          this.throwError(error);
        }
      });

      return object;
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find((type) => metatype === type);
  }

  private throwError(errorList: ValidationError[]) {
    errorList.forEach((errorItem: any) => {
      if (errorItem.contexts) {
        throw new BadRequestException(
          errorItem.contexts[Object.keys(errorItem.contexts)[0]],
        );
      } else if (errorItem.constraints) {
        throw new BadRequestException(
          errorItem.constraints[Object.keys(errorItem.constraints)[0]],
        );
      } else if (errorItem.children && errorItem.children.length !== 0) {
        this.throwError(errorItem.children);
      }
    });
  }
}
