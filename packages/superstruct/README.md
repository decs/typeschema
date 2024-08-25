<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/superstruct</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/superstruct" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fsuperstruct" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/superstruct" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/superstruct.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for Superstruct schemas
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';
import {object, string} from 'superstruct';

import {wrap} from '@typeschema/superstruct';

const schema = object({name: string()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

```

Use it directly or through [`@typeschema/main`](https://github.com/decs/typeschema/tree/main/packages/main)

## Dependencies
- [`superstruct`](https://www.npmjs.com/package/superstruct): Required for inference and validation (`^2.0.2`)

## API

### Inference
- `Infer<TSchema>`: Extracts the output type of a schema

### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of validation issues
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`
