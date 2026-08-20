import { createHmac, timingSafeEqual } from 'node:crypto';

export class HmacHandler {
  private readonly pepper: string;

  constructor(pepper: string) {
    this.pepper = pepper;
  }

  hash(value: string, pepperOverride?: string): string {
    const key = pepperOverride ?? this.pepper;
    return createHmac('sha256', key).update(value).digest('hex');
  }

  compare(value: string, storedHash: string, pepperOverride?: string): boolean {
    const computedHash = this.hash(value, pepperOverride);
    const a = Buffer.from(computedHash);
    const b = Buffer.from(storedHash);
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }
}
