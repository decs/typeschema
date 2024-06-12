<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/valibot</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/valibot" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fvalibot" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/valibot" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/valibot.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for Valibot schemas
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';
import {object, string} from 'valibot';

import {wrap} from '@typeschema/valibot';

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
- [`@gcornut/valibot-json-schema`](https://www.npmjs.com/package/@gcornut/valibot-json-schema): Required for serialization (`^0.31.0`)
- [`valibot`](https://www.npmjs.com/package/valibot): Required for inference and validation (`^0.31.0`)

## API

### Inference
- `Infer<TSchema>`: Extracts the output type of a schema
- `InferIn<TSchema>`: Extracts the input type of a schema

### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of validation issues
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`

### Serialization
- `toJSONSchema(schema)`: Converts the schema into the equivalent JSON schema
