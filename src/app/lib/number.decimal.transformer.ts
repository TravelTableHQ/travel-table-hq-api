import { ValueTransformer } from 'typeorm';

export class NumberDecimalTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: number | null): number | null {
    if (value === null) {
      return null;
    }
    return value;
  }

  // From db to typeorm
  from(value: string): number | null {
    if (value === null) {
      return null;
    }
    return parseFloat(value);
  }
}
