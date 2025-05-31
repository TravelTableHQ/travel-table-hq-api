import { ValueTransformer } from 'typeorm';

export class NumberBigintTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: number | null | undefined): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return value.toString();
  }

  // From db to typeorm
  from(value: string): number | null {
    if (value === null) {
      return null;
    }
    return Number(value);
  }
}
