import { ValueTransformer } from 'typeorm';

export class BoolTinyIntTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: boolean | null): number | null {
    if (value === null) {
      return null;
    }
    return value ? 1 : 0;
  }

  // From db to typeorm
  from(value: number): boolean | null {
    if (value === null) {
      return null;
    }
    return value === 1;
  }
}
