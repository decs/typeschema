<!-- This file is generated. Do not modify it manually! -->

<br />
<p align="center">
  <img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
</p>
<h1 align="center">
  TypeSchema
</h1>
<p align="center">
  Universal adapter for schema validation
  <br />
  ✨ <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>
<br />

<p align="center">
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/main" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fmain" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/core" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/core.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p align="center">
  <a href="#quickstart">Quickstart</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#coverage">Coverage</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="#api">API</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/decs/typeschema">GitHub</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://www.npmjs.com/package/@typeschema/main">npm</a>
</p>
<br />

> When fetching data from an external source, it's important to verify its integrity. This happens when processing user inputs, calling third-party APIs, loading configuration files, and so on. And the thing is: Typescript doesn't come with runtime validation. Any type assertions are [removed at compile-time](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions).
> 
> As a result, developers turn to third-party validation libraries. But that landscape is fragmented, lacking a single best option. Each offers different trade-offs on developer experience, bundle size, and community support.
> 
> TypeSchema enables writing code that [works with any validation library](#coverage) out-of-the-box. It provides a universal adapter for interacting with any validation schema, decoupling from implementation specifics and increasing compatibility.

```ts
import {validate} from '@typeschema/main';

import {z} from 'zod';
import {string} from 'valibot';

const zodSchema = z.string();
await validate(zodSchema, '123');
//    ^? {success: true, data: '123'}

const valibotSchema = string();
await validate(valibotSchema, 123);
//    ^? {success: false, issues: [...]}
```

## Quickstart

We value flexibility, which is why there are multiple ways of using TypeSchema:
1. **Using an adapter directly** (e.g. [`@typeschema/valibot`](https://github.com/decs/typeschema/tree/main/packages/valibot)): Best pick for end developers, when the validation library is known ahead of time. This is particularly useful for supporting more validation libraries on [tRPC](https://trpc.io/).
2. **Handpicking adapters** with [`@typeschema/main`](https://github.com/decs/typeschema/tree/main/packages/main): Recommended for library maintainers. Any validation library can be used, but adapters have to be explicitly installed. This allows end developers to trade-off between coverage and bundle size.
3. **Batteries included** with [`@typeschema/all`](https://github.com/decs/typeschema/tree/main/packages/all): Easiest to use. All adapters are automatically installed, including future ones. This is a drop-in replacement for the deprecated [`@decs/typeschema`](https://www.npmjs.com/package/@decs/typeschema).

## Coverage

| Project             | Popularity                                                                                                                                            | `Infer`                          | `InferIn`                       | Validation                            | Serialization                            | Adapter                                                                                                  |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :------------------------------: | :-----------------------------: | :-----------------------------------: | :--------------------------------------: | :------------------------------------------------------------------------------------------------------- |
| [zod](https://zod.dev) | <a href="https://github.com/colinhacks/zod" rel="nofollow"><img src="https://img.shields.io/github/stars/colinhacks/zod?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | ✅ | [`@typeschema/zod`](https://github.com/decs/typeschema/tree/main/packages/zod) |
| [yup](https://github.com/jquense/yup) | <a href="https://github.com/jquense/yup" rel="nofollow"><img src="https://img.shields.io/github/stars/jquense/yup?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | ✅ | [`@typeschema/yup`](https://github.com/decs/typeschema/tree/main/packages/yup) |
| [joi](https://joi.dev) | <a href="https://github.com/hapijs/joi" rel="nofollow"><img src="https://img.shields.io/github/stars/hapijs/joi?style=social" alt="GitHub stars"></a> | 🧐 | 🧐 | ✅ | 🧐 | [`@typeschema/joi`](https://github.com/decs/typeschema/tree/main/packages/joi) |
| [ajv](https://ajv.js.org) | <a href="https://github.com/ajv-validator/ajv" rel="nofollow"><img src="https://img.shields.io/github/stars/ajv-validator/ajv?style=social" alt="GitHub stars"></a> | 🧐 | 🧐 | ✅ | 🧐 | [`@typeschema/json`](https://github.com/decs/typeschema/tree/main/packages/json) |
| [superstruct](https://docs.superstructjs.org) | <a href="https://github.com/ianstormtaylor/superstruct" rel="nofollow"><img src="https://img.shields.io/github/stars/ianstormtaylor/superstruct?style=social" alt="GitHub stars"></a> | ✅ | 🧐 | ✅ | 🧐 | [`@typeschema/superstruct`](https://github.com/decs/typeschema/tree/main/packages/superstruct) |
| [io-ts](https://gcanti.github.io/io-ts) | <a href="https://github.com/gcanti/io-ts" rel="nofollow"><img src="https://img.shields.io/github/stars/gcanti/io-ts?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/io-ts`](https://github.com/decs/typeschema/tree/main/packages/io-ts) |
| [valibot](https://valibot.dev) | <a href="https://github.com/fabian-hiller/valibot" rel="nofollow"><img src="https://img.shields.io/github/stars/fabian-hiller/valibot?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | ✅ | [`@typeschema/valibot`](https://github.com/decs/typeschema/tree/main/packages/valibot) |
| [typebox](https://github.com/sinclairzx81/typebox) | <a href="https://github.com/sinclairzx81/typebox" rel="nofollow"><img src="https://img.shields.io/github/stars/sinclairzx81/typebox?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/typebox`](https://github.com/decs/typeschema/tree/main/packages/typebox) |
| [typia](https://typia.io) | <a href="https://github.com/samchon/typia" rel="nofollow"><img src="https://img.shields.io/github/stars/samchon/typia?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/function`](https://github.com/decs/typeschema/tree/main/packages/function) |
| [ow](https://sindresorhus.com/ow) | <a href="https://github.com/sindresorhus/ow" rel="nofollow"><img src="https://img.shields.io/github/stars/sindresorhus/ow?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/ow`](https://github.com/decs/typeschema/tree/main/packages/ow) |
| [effect](https://effect.website) | <a href="https://github.com/effect-ts/effect" rel="nofollow"><img src="https://img.shields.io/github/stars/effect-ts/effect?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/effect`](https://github.com/decs/typeschema/tree/main/packages/effect) |
| [arktype](https://arktype.io) | <a href="https://github.com/arktypeio/arktype" rel="nofollow"><img src="https://img.shields.io/github/stars/arktypeio/arktype?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/arktype`](https://github.com/decs/typeschema/tree/main/packages/arktype) |
| [deepkit](https://deepkit.io) | <a href="https://github.com/deepkit/deepkit-framework" rel="nofollow"><img src="https://img.shields.io/github/stars/deepkit/deepkit-framework?style=social" alt="GitHub stars"></a> | 🧐 | 🧐 | ✅ | 🧐 | [`@typeschema/deepkit`](https://github.com/decs/typeschema/tree/main/packages/deepkit) |
| [runtypes](https://github.com/pelotom/runtypes) | <a href="https://github.com/pelotom/runtypes" rel="nofollow"><img src="https://img.shields.io/github/stars/pelotom/runtypes?style=social" alt="GitHub stars"></a> | ✅ | ✅ | ✅ | 🧐 | [`@typeschema/runtypes`](https://github.com/decs/typeschema/tree/main/packages/runtypes) |

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

## Acknowledgements

- Inspired by [tRPC](https://trpc.io/)'s [input & output validators](https://trpc.io/docs/server/validators)
- Adapter architecture inspired by [@ecyrbe](https://github.com/ecyrbe)'s [suggestions](https://github.com/decs/typeschema/issues/1)
- API definition inspired by [@colinhacks](https://github.com/colinhacks)'s [proposal](https://twitter.com/colinhacks/status/1634284724796661761)
- Logo designed by [flaticon](https://www.flaticon.com/)
