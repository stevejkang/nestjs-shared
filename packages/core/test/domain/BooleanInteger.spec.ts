import { describe, it, expect } from 'vitest';
import { BooleanInteger } from '../../src/domain/BooleanInteger';

describe('BooleanInteger', () => {
  it('should be return valid value', () => {
    expect(BooleanInteger.TRUE).toEqual(1);
    expect(BooleanInteger.FALSE).toEqual(0);
  });
});
