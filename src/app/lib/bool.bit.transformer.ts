import { ValueTransformer } from 'typeorm';

export class BoolBitTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: boolean | null): Buffer | null {
    if (value === null) {
      return null;
    }
    const res = Buffer.alloc(1);
    res[0] = value ? 1 : 0;
    return res;
  }

  // From db to typeorm
  from(value: Buffer): boolean | null {
    if (value === null) {
      return null;
    }
    return value[0] === 1;
  }
}
