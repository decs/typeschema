<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/json</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/json" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fjson" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/json" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/json.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for JSON schemas
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';

import {wrap} from '@typeschema/json';

const schema = {
  additionalProperties: false,
  properties: {name: {type: 'string'}},
  required: ['name'],
  type: 'object',
} as const;

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${(input as any).name}!`),
  //         ^? {name: string}
});

```

Use it directly or through [`@typeschema/main`](https://github.com/decs/typeschema/tree/main/packages/main)

## Dependencies
- [`ajv`](https://www.npmjs.com/package/ajv): Required for validation and serialization (`^8.12.0`)
- [`json-schema-to-ts`](https://www.npmjs.com/package/json-schema-to-ts): Required for inference (`^3.0.0`)

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
