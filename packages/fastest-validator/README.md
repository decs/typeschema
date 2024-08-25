<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/fastest-validator</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/fastest-validator" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Ffastest-validator" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/fastest-validator" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/fastest-validator.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for fastest-validator schemas
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';

import {wrap} from '@typeschema/fastest-validator';

const schema = {name: 'string'};

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${(input as any).name}!`),
  //         ^? unknown
});

```

Use it directly or through [`@typeschema/main`](https://github.com/decs/typeschema/tree/main/packages/main)

## Dependencies
- [`fastest-validator`](https://www.npmjs.com/package/fastest-validator):  (`^1.19.0`)

## API

### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of validation issues
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`
