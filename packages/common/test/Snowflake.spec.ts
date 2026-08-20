import { describe, it, expect } from 'vitest';

import { Snowflake } from '../src/Snowflake';

describe('Snowflake', () => {
  describe('generate', () => {
    it('should generate a snowflake with correct timestamp and shard_id', () => {
      const cases = [
        { timestamp: 1653653263221, shard_id: 1 },
        { timestamp: 1653653289600, shard_id: 750 },
        { timestamp: 1653653311149, shard_id: 750 },
      ];

      for (const c of cases) {
        const id = Snowflake.generate({ timestamp: c.timestamp, shard_id: c.shard_id });
        const parsed = Snowflake.parse(id);

        expect(parsed.timestamp).toEqual(c.timestamp);
        expect(parsed.shard_id).toEqual(c.shard_id);
      }
    });

    it('should generate a random snowflake', () => {
      const generated: string[] = [];

      for (let i = 0; i < 5; i++) {
        generated.push(Snowflake.generate());
      }

      expect(generated.length).toEqual(new Set(generated).size);
    });

    it('should generate a unique snowflake across 1M calls', { timeout: 30_000 }, () => {
      const generated: string[] = [];

      for (let i = 0; i < 1e6; i++) {
        generated.push(Snowflake.generate());
      }

      expect(generated.length).toEqual(new Set(generated).size);
    });

    it('should accept a Date object as timestamp', () => {
      const date = new Date(1653653263221);
      const id = Snowflake.generate({ timestamp: date });
      const parsed = Snowflake.parse(id);

      expect(parsed.timestamp).toEqual(1653653263221);
    });

    it('should increment sequence within the same millisecond', () => {
      const ts = 1653653263221;
      const first = Snowflake.generate({ timestamp: ts });
      const second = Snowflake.generate({ timestamp: ts });

      expect(first).not.toEqual(second);

      const seq1 = Snowflake.parse(first).sequence;
      const seq2 = Snowflake.parse(second).sequence;

      expect(seq2).toEqual(seq1 + 1);
    });
  });

  describe('parse', () => {
    it('should round-trip generate and parse', () => {
      const id = Snowflake.generate({ timestamp: 1653653263221, shard_id: 1 });
      const parsed = Snowflake.parse(id);

      expect(parsed.timestamp).toEqual(1653653263221);
      expect(parsed.shard_id).toEqual(1);
      expect(parsed.binary).toHaveLength(64);
    });
  });

  describe('isValid', () => {
    it('should validate a correct snowflake', () => {
      const id = Snowflake.generate();

      expect(Snowflake.isValid(id)).toEqual(true);
    });

    it('should reject non-numeric strings', () => {
      expect(Snowflake.isValid('abv')).toEqual(false);
    });

    it('should reject strings with wrong length', () => {
      expect(Snowflake.isValid('123')).toEqual(false);
    });

  });
});
