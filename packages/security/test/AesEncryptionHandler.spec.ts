import { describe, expect, it } from 'vitest';
import { AesEncryptionHandler } from '../src/AesEncryptionHandler';

const VALID_KEY = '0'.repeat(64);

describe('AesEncryptionHandler', () => {
  describe('constructor', () => {
    it('should accept a valid 64-hex-char key', () => {
      expect(() => new AesEncryptionHandler(VALID_KEY)).not.toThrow();
    });

    it('should throw on key with 63 hex chars', () => {
      expect(() => new AesEncryptionHandler('a'.repeat(63))).toThrow('AES key must be 64 hex characters (32 bytes)');
    });

    it('should throw on key with 65 hex chars', () => {
      expect(() => new AesEncryptionHandler('a'.repeat(65))).toThrow('AES key must be 64 hex characters (32 bytes)');
    });

    it('should throw on empty key', () => {
      expect(() => new AesEncryptionHandler('')).toThrow('AES key must be 64 hex characters (32 bytes)');
    });

    it('should throw on non-hex characters', () => {
      expect(() => new AesEncryptionHandler('g'.repeat(64))).toThrow('AES key must be 64 hex characters (32 bytes)');
    });
  });

  describe('encrypt', () => {
    it('should return a string in iv:authTag:ciphertext format (3 parts)', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const encrypted = handler.encrypt('hello');
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
    });

    it('should produce different ciphertext for same plaintext (random IV)', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const plaintext = 'same plaintext';
      const encrypted1 = handler.encrypt(plaintext);
      const encrypted2 = handler.encrypt(plaintext);
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should work with empty string', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const encrypted = handler.encrypt('');
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
    });

    it('should work with Unicode/Korean characters', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const encrypted = handler.encrypt('안녕하세요 테스트');
      const parts = encrypted.split(':');
      expect(parts).toHaveLength(3);
    });
  });

  describe('decrypt', () => {
    it('should round-trip: decrypt(encrypt(plaintext)) === plaintext', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const plaintext = 'my secret data';
      const encrypted = handler.encrypt(plaintext);
      const decrypted = handler.decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should round-trip with empty string', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const plaintext = '';
      const encrypted = handler.encrypt(plaintext);
      const decrypted = handler.decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should round-trip with Unicode/Korean characters', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const plaintext = '안녕하세요 테스트 🎉';
      const encrypted = handler.encrypt(plaintext);
      const decrypted = handler.decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });

    it('should throw when decrypting tampered ciphertext', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const encrypted = handler.encrypt('original data');
      const parts = encrypted.split(':');
      const tamperedCiphertext = Buffer.from('tampered data').toString('base64');
      const tampered = [parts[0], parts[1], tamperedCiphertext].join(':');
      expect(() => handler.decrypt(tampered)).toThrow();
    });

    it('should throw when decrypting tampered auth tag', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const encrypted = handler.encrypt('original data');
      const parts = encrypted.split(':');
      const tamperedAuthTag = Buffer.from('0'.repeat(16)).toString('base64');
      const tampered = [parts[0], tamperedAuthTag, parts[2]].join(':');
      expect(() => handler.decrypt(tampered)).toThrow();
    });

    it('should throw on malformed encrypted data with only 2 parts', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      expect(() => handler.decrypt('a:b')).toThrow('Invalid encrypted data format');
    });

    it('should throw on empty string input', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      expect(() => handler.decrypt('')).toThrow();
    });

    it('should round-trip with 10KB plaintext', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const plaintext = 'x'.repeat(10 * 1024);
      const encrypted = handler.encrypt(plaintext);
      const decrypted = handler.decrypt(encrypted);
      expect(decrypted).toBe(plaintext);
    });
  });

  describe('compatibility', () => {
    it('should decrypt payload produced by the nestjs-starter static AesEncryptionHandler', () => {
      const handler = new AesEncryptionHandler(VALID_KEY);
      const fixture = 'fT+bZvb2lXPOcQuERDs9Ug==:YLXtr/wLbSW9l5aOEiZK5g==:bxyYCVx4jx5lUJeC4z0rBmQRGdAGwmUVeVlHJQ==';
      const decrypted = handler.decrypt(fixture);
      expect(decrypted).toBe('nestjs-shared-compat-fixture');
    });
  });
});
