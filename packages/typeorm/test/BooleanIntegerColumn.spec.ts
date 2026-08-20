import { describe, it, expect } from 'vitest';
import { validate } from 'class-validator';
import { BooleanIntegerColumn } from '../src/BooleanIntegerColumn';

describe('BooleanIntegerColumn', () => {
  it('should apply as a property decorator without error', () => {
    expect(() => {
      class TestEntity {
        @BooleanIntegerColumn()
        isActive!: boolean;
      }

      return TestEntity;
    }).not.toThrow();
  });

  it('should apply with nullable option without error', () => {
    expect(() => {
      class TestEntity {
        @BooleanIntegerColumn({ nullable: true })
        isActive!: boolean | null;
      }

      return TestEntity;
    }).not.toThrow();
  });

  it('should apply with additional column options without error', () => {
    expect(() => {
      class TestEntity {
        @BooleanIntegerColumn({ default: 0, comment: 'Active flag' })
        isActive!: boolean;
      }

      return TestEntity;
    }).not.toThrow();
  });

  describe('validator', () => {
    it('should pass validation for boolean value', async () => {
      class TestEntity {
        @BooleanIntegerColumn()
        isActive!: boolean;
      }

      const entity = new TestEntity();
      entity.isActive = true;

      const errors = await validate(entity);
      expect(errors).toHaveLength(0);
    });

    it('should fail validation for non-boolean value', async () => {
      class TestEntity {
        @BooleanIntegerColumn()
        isActive!: boolean;
      }

      const entity = new TestEntity();
      (entity as Record<string, unknown>).isActive = 'not-a-boolean';

      const errors = await validate(entity);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation for null when not nullable', async () => {
      class TestEntity {
        @BooleanIntegerColumn()
        isActive!: boolean;
      }

      const entity = new TestEntity();
      (entity as Record<string, unknown>).isActive = null;

      const errors = await validate(entity);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass validation for null when nullable', async () => {
      class TestEntity {
        @BooleanIntegerColumn({ nullable: true })
        isActive!: boolean | null;
      }

      const entity = new TestEntity();
      (entity as Record<string, unknown>).isActive = null;

      const errors = await validate(entity);
      expect(errors).toHaveLength(0);
    });
  });
});
