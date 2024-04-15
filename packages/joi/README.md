<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/joi</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/joi" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fjoi" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/joi" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/joi.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for Joi schemas
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';
import Joi from 'joi';

import {wrap} from '@typeschema/joi';

const schema = Joi.object({name: Joi.string().required()});

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
- [`joi`](https://www.npmjs.com/package/joi): Required for validation (`^17.12.3`)
- [`joi-to-json`](https://www.npmjs.com/package/joi-to-json): Required for serialization (`^4.2.1`)

## API

### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of validation issues
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`

### Serialization
- `toJSONSchema(schema)`: Converts the schema into the equivalent JSON schema
