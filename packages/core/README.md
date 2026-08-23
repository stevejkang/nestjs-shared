# @stevejkang/nestjs-core

![NPM Version](https://img.shields.io/npm/v/%40stevejkang%2Fnestjs-core)

Domain, application, and presentation building blocks for NestJS applications.

## Install

```bash
pnpm add @stevejkang/nestjs-core
```

Peer dependencies:

- `@nestjs/common`
- `@nestjs/swagger`
- `class-validator`
- `class-transformer`
- `reflect-metadata`

## Usage

```typescript
import { AggregateRoot, UniqueEntityID, Result, ValueObject } from '@stevejkang/nestjs-core';

// Value object
class Email extends ValueObject<{ value: string }> {
  static create(value: string): Result<Email> {
    if (!value.includes('@')) return Result.fail('Invalid email');
    return Result.ok(new Email({ value }));
  }
}

// Aggregate root
class User extends AggregateRoot<{ name: string }> {
  static create(name: string): User {
    return new User({ name }, new UniqueEntityID());
  }
}
```

```typescript
import { PaginationQuery, TransformToNumber, IsValidUrl } from '@stevejkang/nestjs-core';

// Presentation decorators
class ListDto extends PaginationQuery {
  @TransformToNumber()
  categoryId!: number;

  @IsValidUrl()
  website!: string;
}
```

## License

MIT
