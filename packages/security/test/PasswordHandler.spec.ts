import { describe, expect, it } from 'vitest';
import { PasswordHandler } from '../src/PasswordHandler';

describe('PasswordHandler', () => {
  describe('hashPassword', () => {
    it('should hash password successfully', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordHandler.hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$argon2id\$/);
    });

    it('should generate different hashes for same password', async () => {
      const password = 'testPassword123';
      const hash1 = await PasswordHandler.hashPassword(password);
      const hash2 = await PasswordHandler.hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });

    it('should throw error for empty password', async () => {
      await expect(PasswordHandler.hashPassword('')).rejects.toThrow('Password cannot be empty');
      await expect(PasswordHandler.hashPassword('   ')).rejects.toThrow('Password cannot be empty');
    });

    it('should throw error for null/undefined password', async () => {
      await expect(PasswordHandler.hashPassword(null as unknown as string)).rejects.toThrow('Password cannot be empty');
      await expect(PasswordHandler.hashPassword(undefined as unknown as string)).rejects.toThrow('Password cannot be empty');
    });

    it('should throw error for too long password', async () => {
      const longPassword = 'a'.repeat(1001);
      await expect(PasswordHandler.hashPassword(longPassword)).rejects.toThrow('Password is too long');
    });

    it('should handle special characters', async () => {
      const specialPassword = 'password!@#$%^&*()_+{}[]|:;<>?,./';
      const hashedPassword = await PasswordHandler.hashPassword(specialPassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toMatch(/^\$argon2id\$/);
    });

    it('should handle unicode characters', async () => {
      const unicodePassword = 'password한글emoji😀';
      const hashedPassword = await PasswordHandler.hashPassword(unicodePassword);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).toMatch(/^\$argon2id\$/);
    });
  });

  describe('comparePasswords', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordHandler.hashPassword(password);

      const result = await PasswordHandler.comparePasswords(password, hashedPassword);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await PasswordHandler.hashPassword(password);

      const result = await PasswordHandler.comparePasswords(wrongPassword, hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false for empty candidate password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordHandler.hashPassword(password);

      const result = await PasswordHandler.comparePasswords('', hashedPassword);
      expect(result).toBe(false);
    });

    it('should return false for null/undefined candidate password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordHandler.hashPassword(password);

      expect(await PasswordHandler.comparePasswords(null as unknown as string, hashedPassword)).toBe(false);
      expect(await PasswordHandler.comparePasswords(undefined as unknown as string, hashedPassword)).toBe(false);
    });

    it('should return false for empty hashed password', async () => {
      const password = 'testPassword123';

      const result = await PasswordHandler.comparePasswords(password, '');
      expect(result).toBe(false);
    });

    it('should return false for null/undefined hashed password', async () => {
      const password = 'testPassword123';

      expect(await PasswordHandler.comparePasswords(password, null as unknown as string)).toBe(false);
      expect(await PasswordHandler.comparePasswords(password, undefined as unknown as string)).toBe(false);
    });

    it('should return false for invalid hash format', async () => {
      const password = 'testPassword123';
      const invalidHash = 'invalid_hash_format';

      const result = await PasswordHandler.comparePasswords(password, invalidHash);
      expect(result).toBe(false);
    });

    it('should handle special characters in password comparison', async () => {
      const specialPassword = 'password!@#$%^&*()_+{}[]|:;<>?,./';
      const hashedPassword = await PasswordHandler.hashPassword(specialPassword);

      const result = await PasswordHandler.comparePasswords(specialPassword, hashedPassword);
      expect(result).toBe(true);
    });

    it('should handle unicode characters in password comparison', async () => {
      const unicodePassword = 'password한글emoji😀';
      const hashedPassword = await PasswordHandler.hashPassword(unicodePassword);

      const result = await PasswordHandler.comparePasswords(unicodePassword, hashedPassword);
      expect(result).toBe(true);
    });
  });

  describe('needsRehash', () => {
    it('should return false for recently hashed password', async () => {
      const password = 'testPassword123';
      const hashedPassword = await PasswordHandler.hashPassword(password);

      const needsRehash = await PasswordHandler.needsRehash(hashedPassword);
      expect(needsRehash).toBe(false);
    });

    it('should return false for invalid hash format', async () => {
      const invalidHash = 'invalid_hash_format';

      const needsRehash = await PasswordHandler.needsRehash(invalidHash);
      expect(needsRehash).toBe(false);
    });

    it('should return false for empty hash', async () => {
      const needsRehash = await PasswordHandler.needsRehash('');
      expect(needsRehash).toBe(false);
    });

    it('should return false for null/undefined hash', async () => {
      expect(await PasswordHandler.needsRehash(null as unknown as string)).toBe(false);
      expect(await PasswordHandler.needsRehash(undefined as unknown as string)).toBe(false);
    });
  });

  describe('integration tests', () => {
    it('should work with multiple password operations', { timeout: 30_000 }, async () => {
      const passwords = ['password1', 'password2', 'password3'];
      const hashes: string[] = [];

      for (const password of passwords) {
        const hash = await PasswordHandler.hashPassword(password);
        hashes.push(hash);
      }

      for (let i = 0; i < passwords.length; i++) {
        const isValid = await PasswordHandler.comparePasswords(passwords[i]!, hashes[i]!);
        expect(isValid).toBe(true);
      }

      for (let i = 0; i < passwords.length; i++) {
        for (let j = 0; j < passwords.length; j++) {
          if (i !== j) {
            const isValid = await PasswordHandler.comparePasswords(passwords[i]!, hashes[j]!);
            expect(isValid).toBe(false);
          }
        }
      }
    });

    it('should handle concurrent operations', { timeout: 30_000 }, async () => {
      const password = 'testPassword123';
      const concurrentOperations = 10;

      const hashPromises = Array(concurrentOperations)
        .fill(null)
        .map(() => PasswordHandler.hashPassword(password));

      const hashes = await Promise.all(hashPromises);

      const uniqueHashes = new Set(hashes);
      expect(uniqueHashes.size).toBe(concurrentOperations);

      const verifyPromises = hashes.map(hash =>
        PasswordHandler.comparePasswords(password, hash)
      );

      const results = await Promise.all(verifyPromises);
      expect(results.every(result => result === true)).toBe(true);
    });
  });
});
