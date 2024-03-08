<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/class-validator</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/class-validator" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fclass-validator" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/class-validator" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/class-validator.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for class-validator classes
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';
import {IsNotEmpty} from 'class-validator';

import {wrap} from '@typeschema/class-validator';

class Schema {
  @IsNotEmpty()
  name!: string;
}
const schema = Schema;

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
- [`class-validator`](https://www.npmjs.com/package/class-validator): Required for inference and validation (`^0.14.1`)

## API

### Inference
- `Infer<TSchema>`: Extracts the output type of a schema
- `InferIn<TSchema>`: Extracts the input type of a schema

### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of validation issues
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`
