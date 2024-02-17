<!-- This file is generated. Do not modify it manually! -->

<h1>
  <img src="https://typeschema.com/assets/logo.png" width="32px" alt="TypeSchema" style="margin-bottom: -6px;" />
  <code>@typeschema/zod</code>
</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/zod" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fzod" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/zod" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/zod.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Reusable adapter for Zod schemas
  <br />
  ✨ <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

```ts
import {initTRPC} from '@trpc/server';
import {z} from 'zod';

import {wrap} from '@typeschema/zod';

const schema = z.object({name: z.string()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${input.name}!`),
  //         ^? {name: string}
});

```

## Setup

<table>
  <tr>
    <th>npm</th>
    <td><code>npm install @typeschema/zod</code></td>
  </tr>
  <tr>
    <th>Yarn</th>
    <td><code>yarn add @typeschema/zod</code></td>
  </tr>
  <tr>
    <th>pnpm</th>
    <td><code>pnpm add @typeschema/zod</code></td>
  </tr>
</table>

Use it directly or through [`@typeschema/main`](https://github.com/decs/typeschema/tree/main/packages/main)

## API

### Inference
- `Infer<TSchema>`: Extracts the output type of a schema
- `InferIn<TSchema>`: Extracts the input type of a schema
### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of `ValidationIssue`s
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`
### Serialization
- `toJSONSchema(schema)`: Converts the schema into the equivalent JSON schema
