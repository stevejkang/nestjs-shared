# @stevejkang/nestjs-security

![NPM Version](https://img.shields.io/npm/v/%40stevejkang%2Fnestjs-security)

Cryptography and password hashing for NestJS applications.

## Install

```bash
pnpm add @stevejkang/nestjs-security
```

Peer dependencies:

- `argon2`

## Usage

```typescript
import { PasswordHandler, AesEncryptionHandler, HmacHandler } from '@stevejkang/nestjs-security';

// Password hashing (argon2id)
const hash = await PasswordHandler.hashPassword('my-password');
const valid = await PasswordHandler.comparePasswords('my-password', hash);

// AES-256-GCM encryption (key: 64 hex chars = 32 bytes)
const aes = new AesEncryptionHandler('0'.repeat(64));
const encrypted = aes.encrypt('secret data');
const decrypted = aes.decrypt(encrypted);

// HMAC-SHA256
const hmac = new HmacHandler('my-pepper');
const hashed = hmac.hash('api-key');
hmac.compare('api-key', hashed); // true
```

## License

MIT
