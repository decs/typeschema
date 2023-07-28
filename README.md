<div id="header">
  <h1 align="center">🛵 TypeSchema</h1>
  <p align="center">Universal adapter for schema validation</p>
  <p align="center">
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://www.npmjs.com/package/@decs/typeschema" rel="nofollow"><img src="https://img.shields.io/npm/dw/@decs/typeschema.svg" alt="NPM Downloads"></a>
  </p>

  <br />
</div>

Many libraries rely on some sort of type validation. Their maintainers have the choice of either to:

1. ⁠**Implement their own** validation logic: which leads to more code to maintain, and we already have many good solutions out there (e.g. [`zod`](https://zod.dev), [`arktype`](https://arktype.io), [`typia`](https://typia.io))
1. **Couple their code** with a specific validation library: which limits adoption by developers who use another
1. **Support multiple** validation libraries: which is a burden to keep up-to-date ([tRPC](https://trpc.io/) picked this one)

There's no best validation library because there's always a tradeoff. Each developer chooses the library that makes the most sense to them. TypeSchema solves this problem by easily providing option 3: **support multiple validation libraries out-of-the-box.**

## Features

- 🚀 Decouple your code from validation libraries
- 🍃 Tiny client footprint
- ✨ Easy-to-use, minimal API

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
</table>

## Usage

```ts
import type {Infer, Schema} from '@decs/typeschema';
import {assert, validate} from '@decs/typeschema';

// Use your favorite validation library, e.g. `zod`, `arktype`, `typia`
const schema: Schema = z.string();
const schema: Schema = type('string');
const schema: Schema = typia.createAssert<string>();

// Extracts the schema type
type Output = Infer<typeof schema>; // `string`
type Input = InferIn<typeof schema>; // `string`

// Returns the validated data or throws a `ValidationIssue`
await assert(schema, '123'); // '123'
await assert(schema, 123); // throws `ValidationIssue`

// Returns the validated data or a list of `ValidationIssue`s
await validate(schema, '123'); // {data: '123'}
await validate(schema, 123); // {issues: [`ValidationIssue`]}

// Returns an assertion function for a specific schema
const assertString = createAssert(schema);
await assertString('123'); // '123'
await assertString(123); // throws `ValidationIssue`
```

## API

#### Types

- `Schema`

  Generic interface for schemas<br />An union of the schema types of all supported libraries

- `ValidationIssue`

  Generic interface for validation issues<br />Includes a `message: string` and an optional `path?: Array<string | number | symbol>`

- `Infer<TSchema extends Schema>`

  Extracts the output type of a schema

- `InferIn<TSchema extends Schema>`

  Extracts the input type of a schema

#### Functions

- `assert(schema, data)`

  ```ts
  assert<TSchema extends Schema>(
    schema: TSchema,
    data: unknown,
  ): Promise<Infer<TSchema>>
  ```

  Returns the validated data or throws a `ValidationIssue`

- `validate(schema, data)`

  ```ts
  validate<TSchema extends Schema>(
    schema: TSchema,
    data: unknown,
  ): Promise<{data: Infer<TSchema>} | {issues: Array<ValidationIssue>}>
  ```

  Returns the validated data or a list of `ValidationIssue`s

- `createAssert(schema)`

  ```ts
  createAssert<TSchema extends Schema>(
    schema: TSchema,
  ): (data: unknown) => Promise<Infer<TSchema>>
  ```

  Returns an assertion function for a specific schema

## Coverage

TypeSchema supports all major schema validation libraries:

| Project                                            | Popularity                                                                                       | Example schema                 | Support |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------ | ------- |
| [zod](https://zod.dev)                             | ![GitHub Stars](https://img.shields.io/github/stars/colinhacks/zod.svg?style=social)             | `z.string()`                   | ✅      |
| [yup](https://github.com/jquense/yup)              | ![GitHub Stars](https://img.shields.io/github/stars/jquense/yup.svg?style=social)                | `string()`                     | ✅      |
| [joi](https://joi.dev)                             | ![GitHub Stars](https://img.shields.io/github/stars/hapijs/joi.svg?style=social)                 | `Joi.string()`                 | ✅[^1]  |
| [ajv](https://ajv.js.org)                          | ![GitHub Stars](https://img.shields.io/github/stars/ajv-validator/ajv.svg?style=social)          | `{type: "string"} as const`    | ✅      |
| [superstruct](https://docs.superstructjs.org)      | ![GitHub Stars](https://img.shields.io/github/stars/ianstormtaylor/superstruct.svg?style=social) | `string()`                     | ✅[^2]  |
| [io-ts](https://gcanti.github.io/io-ts)            | ![GitHub Stars](https://img.shields.io/github/stars/gcanti/io-ts.svg?style=social)               | `t.string`                     | ✅      |
| [ow](https://sindresorhus.com/ow)                  | ![GitHub Stars](https://img.shields.io/github/stars/sindresorhus/ow.svg?style=social)            | `ow.string`                    | ✅[^3]  |
| [typebox](https://github.com/sinclairzx81/typebox) | ![GitHub Stars](https://img.shields.io/github/stars/sinclairzx81/typebox.svg?style=social)       | `Type.String()`                | ✅      |
| [typia](https://typia.io)                          | ![GitHub Stars](https://img.shields.io/github/stars/samchon/typia.svg?style=social)              | `typia.createAssert<string>()` | ✅      |
| [deepkit](https://deepkit.io)                      | ![GitHub Stars](https://img.shields.io/github/stars/deepkit/deepkit-framework.svg?style=social)  | `typeOf<string>()`             | ✅[^1]  |
| [runtypes](https://github.com/pelotom/runtypes)    | ![GitHub Stars](https://img.shields.io/github/stars/pelotom/runtypes.svg?style=social)           | `String`                       | ✅      |
| [arktype](https://arktype.io)                      | ![GitHub Stars](https://img.shields.io/github/stars/arktypeio/arktype.svg?style=social)          | `type('string')`               | ✅      |

[^1]: Type inference is not yet supported for [joi](https://joi.dev) and [deepkit](https://deepkit.io)
[^2]: Input type inference is not yet supported for [superstruct](https://docs.superstructjs.org)
[^3]: For [ow](https://sindresorhus.com/ow), only v0.28.2 is supported (sindresorhus/ow#248)

Custom validations are also supported:

```ts
export function assertString(data: unknown): string {
  if (typeof data !== 'string') {
    throw new Error('Expected a string, got: ' + data);
  }
  return data;
}

await assert(assertString, '123'); // '123'
await assert(assertString, 123); // throws `ValidationIssue`

await validate(assertString, '123'); // {data: '123'}
await validate(assertString, 123); // {issues: [`ValidationIssue`]}
```

## Acknowledgements

- Inspired by [tRPC](https://trpc.io/)'s [input & output validators](https://trpc.io/docs/server/validators)
- Adapter architecture inspired by [@ecyrbe](https://github.com/ecyrbe)'s [suggestions](https://github.com/decs/typeschema/issues/1)
- API definition inspired by [@colinhacks](https://github.com/colinhacks)'s [proposal](https://twitter.com/colinhacks/status/1634284724796661761)
- JSON Schema type inference powered by [`json-schema-to-ts`](https://github.com/ThomasAribart/json-schema-to-ts)
