import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { HmacHandler } from '../src/HmacHandler';

const TEST_PEPPER = 'test-pepper';

describe('HmacHandler', () => {
  describe('hash()', () => {
    it('produces consistent output for same input', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const value = 'test-api-key';
      const hash1 = handler.hash(value);
      const hash2 = handler.hash(value);
      expect(hash1).toBe(hash2);
    });

    it('produces different output for different inputs', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const hash1 = handler.hash('input-a');
      const hash2 = handler.hash('input-b');
      expect(hash1).not.toBe(hash2);
    });

    it('returns a hex string', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const hash = handler.hash('some-value');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('produces different hashes with different peppers', () => {
      const value = 'same-value';
      const handler = new HmacHandler(TEST_PEPPER);
      const hash1 = handler.hash(value, 'pepper-one');
      const hash2 = handler.hash(value, 'pepper-two');
      expect(hash1).not.toBe(hash2);
    });

    it('handles empty string input', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const hash = handler.hash('');
      expect(hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it('per-call pepper overrides constructor pepper', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const value = 'override-test';
      const hashDefault = handler.hash(value);
      const hashExplicit = handler.hash(value, 'explicit-pepper');
      expect(hashDefault).not.toBe(hashExplicit);
    });

    it('matches a locally computed HMAC-SHA256 reference', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const value = 'cross-check-value';
      const pepper = 'reference-pepper';
      const expected = createHmac('sha256', pepper).update(value).digest('hex');
      expect(handler.hash(value, pepper)).toBe(expected);
    });
  });

  describe('compare()', () => {
    it('returns true for matching value and hash', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const value = 'my-secret-key';
      const storedHash = handler.hash(value);
      expect(handler.compare(value, storedHash)).toBe(true);
    });

    it('returns false for non-matching value', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const storedHash = handler.hash('correct-value');
      expect(handler.compare('wrong-value', storedHash)).toBe(false);
    });

    it('handles empty string gracefully', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const storedHash = handler.hash('');
      expect(handler.compare('', storedHash)).toBe(true);
    });

    it('returns false when comparing empty string against non-empty hash', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const storedHash = handler.hash('non-empty');
      expect(handler.compare('', storedHash)).toBe(false);
    });

    it('uses pepper consistently in compare', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const value = 'api-key-value';
      const pepper = 'custom-pepper';
      const storedHash = handler.hash(value, pepper);
      expect(handler.compare(value, storedHash, pepper)).toBe(true);
    });

    it('returns false when pepper differs between hash and compare', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      const value = 'api-key-value';
      const storedHash = handler.hash(value, 'pepper-a');
      expect(handler.compare(value, storedHash, 'pepper-b')).toBe(false);
    });

    it('returns false without throwing when storedHash has different length', () => {
      const handler = new HmacHandler(TEST_PEPPER);
      expect(handler.compare('some-value', 'short')).toBe(false);
    });
  });
});
