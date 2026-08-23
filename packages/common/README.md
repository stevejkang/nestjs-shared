# @stevejkang/nestjs-common

![NPM Version](https://img.shields.io/npm/v/%40stevejkang%2Fnestjs-common)

Project-wide utilities for NestJS applications.

## Install

```bash
pnpm add @stevejkang/nestjs-common
```

Peer dependencies:

- `@nestjs/common`

## Usage

```typescript
import { Snowflake, ExternalId, RequestContext, Semaphore, TimeUnit } from '@stevejkang/nestjs-common';

// Generate a Snowflake ID
const id = Snowflake.generate();

// Encode/decode external-facing IDs
const encoded = ExternalId.encode(42, 'user');
const decoded = ExternalId.decode(encoded, 'user'); // 42

// Trace ID propagation via AsyncLocalStorage
RequestContext.run({ traceId: id }, () => {
  RequestContext.getTraceId(); // returns id
});

// Concurrency control
const sem = new Semaphore({ maxConcurrency: 5 });
await sem.execute(async () => { /* ... */ });

// Duration conversion
TimeUnit.fromMinutes(30).toMilliseconds(); // 1800000
```

## License

MIT
