# @stevejkang/nestjs-typeorm

Custom column decorators and transformers for TypeORM.

## Install

```bash
pnpm add @stevejkang/nestjs-typeorm
```

Peer dependencies:

- `typeorm`
- `class-validator`
- `dayjs`
- `reflect-metadata`

## Usage

```typescript
import { BigIntColumn, BigIntPrimaryColumn, BooleanIntegerColumn, DateColumn, DateTimeColumn } from '@stevejkang/nestjs-typeorm';

@Entity()
class Post {
  @BigIntPrimaryColumn()
  id!: number;

  @BigIntColumn()
  authorId!: number;

  @BooleanIntegerColumn()
  isPublished!: boolean;

  @DateColumn()
  publishDate!: Date;

  @DateTimeColumn()
  createdAt!: Date;
}
```

## License

MIT
