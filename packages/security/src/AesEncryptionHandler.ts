import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

export class AesEncryptionHandler {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;

  private readonly key: Buffer;

  constructor(key: string) {
    if (!/^[0-9a-fA-F]{64}$/.test(key)) {
      throw new Error('AES key must be 64 hex characters (32 bytes)');
    }

    this.key = Buffer.from(key, 'hex');
  }

  encrypt(plaintext: string): string {
    const iv = randomBytes(AesEncryptionHandler.IV_LENGTH);
    const cipher = createCipheriv(AesEncryptionHandler.ALGORITHM, this.key, iv);

    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join(':');
  }

  decrypt(payload: string): string {
    const parts = payload.split(':');
    if (parts.length !== 3 || parts[0] === undefined || parts[1] === undefined || parts[2] === undefined) {
      throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(parts[0], 'base64');
    const authTag = Buffer.from(parts[1], 'base64');
    const encrypted = Buffer.from(parts[2], 'base64');

    const decipher = createDecipheriv(AesEncryptionHandler.ALGORITHM, this.key, iv);
    decipher.setAuthTag(authTag);

    return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
  }
}
