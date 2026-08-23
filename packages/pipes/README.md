# @stevejkang/nestjs-pipes

![NPM Version](https://img.shields.io/npm/v/%40stevejkang%2Fnestjs-pipes)

Validation and transformation pipes for NestJS applications.

## Install

```bash
pnpm add @stevejkang/nestjs-pipes
```

Peer dependencies:

- `@nestjs/common`
- `class-validator`
- `reflect-metadata`

## Usage

```typescript
import { AppValidationPipe, ParseExternalIdPipe } from '@stevejkang/nestjs-pipes';

// Global validation pipe (skips primitive coercion for @Param/@Query)
app.useGlobalPipes(new AppValidationPipe({ whitelist: true, transform: true }));

// Parse external IDs in controllers
@Get(':id')
findOne(@Param('id', new ParseExternalIdPipe('user')) id: number) {
  // id is the decoded internal numeric ID
}
```

## License

MIT
