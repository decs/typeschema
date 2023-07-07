<h1 align="center">🛵 TypeSchema</h1>
<p align="center">Universal adapter for schema validation</p>
<p align="center">
<a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
<a href="https://www.npmjs.com/package/@decs/typeschema" rel="nofollow"><img src="https://img.shields.io/npm/dw/@decs/typeschema.svg" alt="NPM Downloads"></a>
</p>

<br />

Many libraries rely on some sort of type validation. Their maintainers have the choice of either to:

1. ⁠**Implement their own** validation logic: which leads to more code to maintain, and we already have many good solutions out there (e.g. [zod](https://zod.dev), [arktype](https://arktype.io), [typia](https://typia.io))
1. **Couple their code** with a specific validation library: which limits adoption by developers who use another
1. **Support multiple** validation libraries: which is a burden to keep up-to-date ([tRPC](https://trpc.io/) picked this one)

There's no best validation library because there's always a tradeoff. Each developer chooses the library that makes the most sense to them. TypeSchema solves this problem by easily providing option 3: **support multiple validation libraries out-of-the-box.**

## Features

- 🚀 Decouple your code from validation libraries
- 🍃 Less than 3 kB, zero dependencies
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
import {assert} from '@decs/typeschema';

// Use your favorite validation library, e.g. `zod`, `arktype`, `typia`
const schema: Schema<string> = z.string();
const schema: Schema<string> = type('string');
const schema: Schema<string> = typia.createAssert<string>();

// Extracts the schema type
type Type = Infer<typeof schema>; // `string`

// Returns the validated data or throws an exception
await assert(schema, '123'); // '123'
await assert(schema, 123); // `Error`
```

## API

#### Types
- `Schema<T>`<br />Generic interface for schemas
- `Infer<T as Schema<unknown>>`<br />Extracts the equivalent TypeScript type of a schema

#### Functions
- `assert<T>(schema: Schema<T>, data: unknown): Promise<T>`<br />Returns the validated data or throws an exception

## Coverage

| Project                                            | Popularity                                                                                       | Example schema                 | Support            |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------ | ------------------ |
| [zod](https://zod.dev)                             | ![GitHub Stars](https://img.shields.io/github/stars/colinhacks/zod.svg?style=social)             | `z.string()`                   | ✅ |
| [yup](https://github.com/jquense/yup)              | ![GitHub Stars](https://img.shields.io/github/stars/jquense/yup.svg?style=social)                | `string()`                     | ✅ |
| [joi](https://joi.dev)                             | ![GitHub Stars](https://img.shields.io/github/stars/hapijs/joi.svg?style=social)                 | `Joi.string()`                 | ✅                 |
| [superstruct](https://docs.superstructjs.org)      | ![GitHub Stars](https://img.shields.io/github/stars/ianstormtaylor/superstruct.svg?style=social) | `string()`                     | ✅                 |
| [io-ts](https://gcanti.github.io/io-ts)            | ![GitHub Stars](https://img.shields.io/github/stars/gcanti/io-ts.svg?style=social)               | `t.string`                     | ❌                 |
| [ow](https://sindresorhus.com/ow)                  | ![GitHub Stars](https://img.shields.io/github/stars/sindresorhus/ow.svg?style=social)            | `ow.string`                    | ❌                 |
| [typebox](https://github.com/sinclairzx81/typebox) | ![GitHub Stars](https://img.shields.io/github/stars/sinclairzx81/typebox.svg?style=social)       | `Type.String()`                | ❌                 |
| [typia](https://typia.io)                          | ![GitHub Stars](https://img.shields.io/github/stars/samchon/typia.svg?style=social)              | `typia.createAssert<string>()` | ✅                 |
| [runtypes](https://github.com/pelotom/runtypes)    | ![GitHub Stars](https://img.shields.io/github/stars/pelotom/runtypes.svg?style=social)           | `String`                       | ✅                 |
| [arktype](https://arktype.io)                      | ![GitHub Stars](https://img.shields.io/github/stars/arktypeio/arktype.svg?style=social)          | `type('string')`               | ✅                 |

Custom validations are also supported:

```ts
export function assertString(data: unknown): string {
  if (typeof data !== 'string') {
    throw new Error('Expected a string, got: ' + data);
  }
  return data;
}

await assert(assertString, '123'); // Returns '123'
await assert(assertString, 123); // Throws an exception
```

## Acknowledgements

* Inspired by [tRPC](https://trpc.io/)'s [input & output validators](https://trpc.io/docs/server/validators)
