import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class Utils {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  isEmpty(num: any) {
    return num === undefined || num === null || Number.isNaN(num);
  }

  isAllEmpty(...params: any[]) {
    return params.every((item) => this.isEmpty(item));
  }

  isAllNotEmpty(...params: any[]) {
    return params.every((item) => !this.isEmpty(item));
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  pad(pn: string, width: number, pz: string | undefined = undefined) {
    let n = pn;
    let z = pz;
    z = z || '0';
    n += '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  isNumeric(numParam: string, opt?: string) {
    // 좌우 trim(공백제거)을 해준다.
    let num = String(numParam).replace(/^\s+|\s+$/g, '');
    let regex;

    if (typeof opt === 'undefined' || opt === '1') {
      // 모든 10진수 (부호 선택, 자릿수구분기호 선택, 소수점 선택)
      // eslint-disable-next-line no-useless-escape
      regex = /^[+\-]?(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+)(\.[0-9]+)?$/g;
    } else if (opt === '2') {
      // 부호 미사용, 자릿수구분기호 선택, 소수점 선택
      regex = /^(([1-9][0-9]{0,2}(,[0-9]{3})*)|[0-9]+){1}(\.[0-9]+)?$/g;
    } else if (opt === '3') {
      // 부호 미사용, 자릿수구분기호 미사용, 소수점 선택
      regex = /^[0-9]+(\.[0-9]+)?$/g;
    } else {
      // only 숫자만(부호 미사용, 자릿수구분기호 미사용, 소수점 미사용)
      regex = /^[0-9]$/g;
    }

    if (regex && regex.test(num)) {
      num = num.replace(/,/g, '');
      return !Number.isNaN(Number(num));
    }
    return false;
  }

  parseNum(str: string, returnType: any = undefined) {
    try {
      const number = `${str}`;

      if (this.isNumeric(number)) {
        return Number(number.replace(/^\s+|\s+$/g, '').replace(/,/g, ''));
      }
      return returnType;
    } catch (e) {
      this.logger.debug(
        `============================ parse Error ${str}, ${typeof str} ${e}`,
      );
      return returnType;
    }
  }

  /**
   * Date객체를 '19700101' 형태로 포맷
   * @param {Date} date
   * @returns
   */
  formatDateYyyyMmDd(date: Date) {
    const year = date.getFullYear();
    const month = `0${1 + date.getMonth()}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return year + month + day;
  }

  NUM(num: any): number {
    return this.isEmpty(num) ? 0 : num;
  }

  ABS(num: any): number | undefined {
    return this.isEmpty(num) ? undefined : Math.abs(num);
  }

  toCamelCase(str: string) {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  }
}
