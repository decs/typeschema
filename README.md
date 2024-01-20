<br />
<p align="center">
  <img src="assets/logo.png" width="64px" alt="TypeSchema" />
</p>
<h1 align="center">
  TypeSchema
</h1>
<p align="center">
  ✨ <a href="https://typeschema.com">https://typeschema.com</a> ✨
  <br />
  Universal adapter for schema validation
</p>
<br />

<p align="center">
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@decs/typeschema" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40decs%2Ftypeschema" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@decs/typeschema" rel="nofollow"><img src="https://img.shields.io/npm/dw/@decs/typeschema.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p align="center">
  <a href="#setup">Setup</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#api">API</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#coverage">Coverage</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/decs/typeschema">GitHub</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@decs/typeschema">npm</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://deno.land/x/typeschema">Deno</a>
</p>
<br />

Many libraries rely on some sort of type validation. Their maintainers have the choice of either to:

1. ⁠**Implement their own** validation logic: which leads to more code to maintain, and we already have many good solutions out there (e.g. [`zod`](https://zod.dev), [`arktype`](https://arktype.io), [`typia`](https://typia.io))
1. **Couple their code** with a specific validation library: which limits adoption by developers who use another
1. **Support multiple** validation libraries: which is a burden to keep up-to-date (e.g. [tRPC](https://trpc.io/))

There's no best validation library because there's always a tradeoff. Each developer chooses the library that makes the most sense to them. TypeSchema solves this problem by easily providing option 3: **support multiple validation libraries out-of-the-box.**

## Features

- 🚀 Decouple from schema validation libraries
- 🍃 Tiny client footprint, tree-shakeable
- 🛋️ Easy-to-use, minimal API

## Usage

```ts
import type {Infer, InferIn, Schema} from '@decs/typeschema';
import {assert, validate, wrap} from '@decs/typeschema';

// Use your favorite validation library, e.g. `zod`, `arktype`, `typia`
const schema: Schema = z.string();
const schema: Schema = type('string');
const schema: Schema = typia.createAssert<string>();

// Extracts the schema type
type Output = Infer<typeof schema>; // `string`
type Input = InferIn<typeof schema>; // `string`

// Returns the wrapped schema with access to all its operations
const wrapped = wrap(schema);
await wrapped.validate('123'); // {success: true, data: '123'}
await wrapped.assert('123'); // '123'

// Returns the validated data or a list of `ValidationIssue`s
await validate(schema, '123'); // {success: true, data: '123'}
await validate(schema, 123); // {success: false, issues: [`ValidationIssue`]}

// Returns the validated data or throws an `AggregateError`
await assert(schema, '123'); // '123'
await assert(schema, 123); // throws `AggregateError`
```

#### tRPC

You can use any supported schema on [tRPC](https://trpc.io/) through the `wrap` function:

```ts
import {wrap} from '@decs/typeschema';
import {initTRPC} from '@trpc/server';
import {object, string} from 'valibot';

// Use your favorite validation library, e.g. `valibot`
const schema = object({name: string()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema)) // like this
    .query(({input}) => `Hello, ${input.name}!`),
});
```

## Coverage

TypeSchema supports all major schema validation libraries:

| Project                                            |                                                                                      Popularity                                                                                       | `wrap` | `validate`<br/>`assert` | `Infer` | `InferIn` | Example schema                 |
| :------------------------------------------------- | :-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----: | :---------------------: | :-----: | :-------: | :----------------------------- |
| [zod](https://zod.dev)                             |             <a href="https://github.com/colinhacks/zod" rel="nofollow"><img src="https://img.shields.io/github/stars/colinhacks/zod?style=social" alt="GitHub stars"></a>             |   ✅   |           ✅            |   ✅    |    ✅     | `z.string()`                   |
| [yup](https://github.com/jquense/yup)              |                <a href="https://github.com/jquense/yup" rel="nofollow"><img src="https://img.shields.io/github/stars/jquense/yup?style=social" alt="GitHub stars"></a>                |   ✅   |           ✅            |   ✅    |    ✅     | `string()`                     |
| [joi](https://joi.dev)                             |                 <a href="https://github.com/hapijs/joi" rel="nofollow"><img src="https://img.shields.io/github/stars/hapijs/joi?style=social" alt="GitHub stars"></a>                 |   ✅   |           ✅            |   ❌    |    ❌     | `Joi.string()`                 |
| [ajv](https://ajv.js.org)                          |          <a href="https://github.com/ajv-validator/ajv" rel="nofollow"><img src="https://img.shields.io/github/stars/ajv-validator/ajv?style=social" alt="GitHub stars"></a>          |   ✅   |           ✅            |   ❌    |    ❌     | `{type: "string"}`             |
| [superstruct](https://docs.superstructjs.org)      | <a href="https://github.com/ianstormtaylor/superstruct" rel="nofollow"><img src="https://img.shields.io/github/stars/ianstormtaylor/superstruct?style=social" alt="GitHub stars"></a> |   ✅   |           ✅            |   ✅    |    ❌     | `string()`                     |
| [io-ts](https://gcanti.github.io/io-ts)            |               <a href="https://github.com/gcanti/io-ts" rel="nofollow"><img src="https://img.shields.io/github/stars/gcanti/io-ts?style=social" alt="GitHub stars"></a>               |   ✅   |           ✅            |   ✅    |    ✅     | `t.string`                     |
| [valibot](https://valibot.dev)                     |      <a href="https://github.com/fabian-hiller/valibot" rel="nofollow"><img src="https://img.shields.io/github/stars/fabian-hiller/valibot?style=social" alt="GitHub stars"></a>      |   ✅   |           ✅            |   ✅    |    ✅     | `string()`                     |
| [typebox](https://github.com/sinclairzx81/typebox) |       <a href="https://github.com/sinclairzx81/typebox" rel="nofollow"><img src="https://img.shields.io/github/stars/sinclairzx81/typebox?style=social" alt="GitHub stars"></a>       |   ✅   |           ✅            |   ✅    |    ✅     | `Type.String()`                |
| [typia](https://typia.io)                          |              <a href="https://github.com/samchon/typia" rel="nofollow"><img src="https://img.shields.io/github/stars/samchon/typia?style=social" alt="GitHub stars"></a>              |   ✅   |           ✅            |   ✅    |    ✅     | `typia.createAssert<string>()` |
| [ow](https://sindresorhus.com/ow)[^1]              |            <a href="https://github.com/sindresorhus/ow" rel="nofollow"><img src="https://img.shields.io/github/stars/sindresorhus/ow?style=social" alt="GitHub stars"></a>            |   ✅   |           ✅            |   ✅    |    ✅     | `ow.string`                    |
| [effect](https://effect.website)                   |           <a href="https://github.com/Effect-TS/effect" rel="nofollow"><img src="https://img.shields.io/github/stars/effect-ts/effect?style=social" alt="GitHub stars"></a>           |   ✅   |           ✅            |   ✅    |    ✅     | `S.string`                     |
| [arktype](https://arktype.io)                      |          <a href="https://github.com/arktypeio/arktype" rel="nofollow"><img src="https://img.shields.io/github/stars/arktypeio/arktype?style=social" alt="GitHub stars"></a>          |   ✅   |           ✅            |   ✅    |    ✅     | `type('string')`               |
| [deepkit](https://deepkit.io)                      |  <a href="https://github.com/deepkit/deepkit-framework" rel="nofollow"><img src="https://img.shields.io/github/stars/deepkit/deepkit-framework?style=social" alt="GitHub stars"></a>  |   ✅   |           ✅            |   ❌    |    ❌     | `typeOf<string>()`             |
| [runtypes](https://github.com/pelotom/runtypes)    |           <a href="https://github.com/pelotom/runtypes" rel="nofollow"><img src="https://img.shields.io/github/stars/pelotom/runtypes?style=social" alt="GitHub stars"></a>           |   ✅   |           ✅            |   ✅    |    ✅     | `String`                       |

[^1]: For [ow](https://sindresorhus.com/ow), only v0.28.2 is supported (sindresorhus/ow#248)

Custom validations are also supported:

```ts
export function assertString(data: unknown): string {
  if (typeof data !== 'string') {
    throw new Error('Expected a string, got: ' + data);
  }
  return data;
}

await validate(assertString, '123'); // {success: true, data: '123'}
await validate(assertString, 123); // {success: false, issues: [`ValidationIssue`]}

await assert(assertString, '123'); // '123'
await assert(assertString, 123); // throws `AggregateError`
```

## Setup

Install TypeSchema with your package manager of choice:

<table>
  <tr>
    <th>npm</th>
    <td><code>npm install @decs/typeschema</code></td>
  </tr>
  <tr>
    <th>Yarn</th>
    <td><code>yarn add @decs/typeschema</code></td>
  </tr>
  <tr>
    <th>pnpm</th>
    <td><code>pnpm add @decs/typeschema</code></td>
  </tr>
  <tr>
    <th>Deno</th>
    <td><code>https://deno.land/x/typeschema</code></td>
  </tr>
</table>

## API

#### Types

- `Schema`

  Generic interface for schemas<br />An union of the schema types of all supported libraries

- `TypeSchema<TOutput, TInput = TOutput>`

  Interface for a wrapped schema, exposing all its operations

- `Infer<TSchema extends Schema>`

  Extracts the output type of a schema

- `InferIn<TSchema extends Schema>`

  Extracts the input type of a schema

- `ValidationIssue`

  Generic interface for validation issues<br />Includes a `message` and an optional `path`

#### Functions

- `wrap(schema)`

  ```ts
  wrap<TSchema extends Schema>(
    schema: TSchema,
  ): TypeSchema<Infer<TSchema>, InferIn<TSchema>>
  ```

  Returns the wrapped schema with access to all its operations

- `validate(schema, data)`

  ```ts
  validate<TSchema extends Schema>(
    schema: TSchema,
    data: unknown,
  ): Promise<ValidationResult<Infer<TSchema>>>
  ```

  Returns the validated data or a list of `ValidationIssue`s

- `assert(schema, data)`

  ```ts
  assert<TSchema extends Schema>(
    schema: TSchema,
    data: unknown,
  ): Promise<Infer<TSchema>>
  ```

  Returns the validated data or throws an `AggregateError`

## Acknowledgements

- Inspired by [tRPC](https://trpc.io/)'s [input & output validators](https://trpc.io/docs/server/validators)
- Adapter architecture inspired by [@ecyrbe](https://github.com/ecyrbe)'s [suggestions](https://github.com/decs/typeschema/issues/1)
- API definition inspired by [@colinhacks](https://github.com/colinhacks)'s [proposal](https://twitter.com/colinhacks/status/1634284724796661761)
- Logo designed by [flaticon](https://www.flaticon.com/)
