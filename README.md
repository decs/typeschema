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

<table>
  <tr>
    <th align="left">Project</th>
    <th align="left">Popularity</th>
    <th align="center"><code>Infer</code></th>
    <th align="center"><code>InferIn</code></th>
    <th align="center">Validation</th>
    <th align="center">Serialization</th>
    <th align="left">Adapter</th>
    <th align="right">Downloads</th>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://zod.dev" rel="nofollow">zod</a></nobr></td>
    <td align="left"><a href="https://github.com/colinhacks/zod" rel="nofollow"><img src="https://img.shields.io/github/stars/colinhacks/zod?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/zod">@typeschema/zod</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/zod" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/zod.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/jquense/yup" rel="nofollow">yup</a></nobr></td>
    <td align="left"><a href="https://github.com/jquense/yup" rel="nofollow"><img src="https://img.shields.io/github/stars/jquense/yup?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/yup">@typeschema/yup</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/yup" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/yup.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://joi.dev" rel="nofollow">joi</a></nobr></td>
    <td align="left"><a href="https://github.com/hapijs/joi" rel="nofollow"><img src="https://img.shields.io/github/stars/hapijs/joi?style=social" alt="GitHub stars"></a></td>
    <td align="center">🧐</td>
    <td align="center">🧐</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/joi">@typeschema/joi</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/joi" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/joi.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://ajv.js.org" rel="nofollow">ajv</a></nobr></td>
    <td align="left"><a href="https://github.com/ajv-validator/ajv" rel="nofollow"><img src="https://img.shields.io/github/stars/ajv-validator/ajv?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/json">@typeschema/json</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/json" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/json.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/typestack/class-validator" rel="nofollow">class-validator</a></nobr></td>
    <td align="left"><a href="https://github.com/typestack/class-validator" rel="nofollow"><img src="https://img.shields.io/github/stars/typestack/class-validator?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/class-validator">@typeschema/class-validator</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/class-validator" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/class-validator.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://effect.website" rel="nofollow">effect</a></nobr></td>
    <td align="left"><a href="https://github.com/effect-ts/effect" rel="nofollow"><img src="https://img.shields.io/github/stars/effect-ts/effect?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/effect">@typeschema/effect</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/effect" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/effect.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://docs.superstructjs.org" rel="nofollow">superstruct</a></nobr></td>
    <td align="left"><a href="https://github.com/ianstormtaylor/superstruct" rel="nofollow"><img src="https://img.shields.io/github/stars/ianstormtaylor/superstruct?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/superstruct">@typeschema/superstruct</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/superstruct" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/superstruct.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://gcanti.github.io/io-ts" rel="nofollow">io-ts</a></nobr></td>
    <td align="left"><a href="https://github.com/gcanti/io-ts" rel="nofollow"><img src="https://img.shields.io/github/stars/gcanti/io-ts?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/io-ts">@typeschema/io-ts</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/io-ts" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/io-ts.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://valibot.dev" rel="nofollow">valibot</a></nobr></td>
    <td align="left"><a href="https://github.com/fabian-hiller/valibot" rel="nofollow"><img src="https://img.shields.io/github/stars/fabian-hiller/valibot?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/valibot">@typeschema/valibot</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/valibot" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/valibot.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/sinclairzx81/typebox" rel="nofollow">typebox</a></nobr></td>
    <td align="left"><a href="https://github.com/sinclairzx81/typebox" rel="nofollow"><img src="https://img.shields.io/github/stars/sinclairzx81/typebox?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/typebox">@typeschema/typebox</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/typebox" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/typebox.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://typia.io" rel="nofollow">typia</a></nobr></td>
    <td align="left"><a href="https://github.com/samchon/typia" rel="nofollow"><img src="https://img.shields.io/github/stars/samchon/typia?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/function">@typeschema/function</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/function" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/function.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://arktype.io" rel="nofollow">arktype</a></nobr></td>
    <td align="left"><a href="https://github.com/arktypeio/arktype" rel="nofollow"><img src="https://img.shields.io/github/stars/arktypeio/arktype?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/arktype">@typeschema/arktype</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/arktype" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/arktype.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://sindresorhus.com/ow" rel="nofollow">ow</a></nobr></td>
    <td align="left"><a href="https://github.com/sindresorhus/ow" rel="nofollow"><img src="https://img.shields.io/github/stars/sindresorhus/ow?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/ow">@typeschema/ow</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/ow" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/ow.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://deepkit.io" rel="nofollow">deepkit</a></nobr></td>
    <td align="left"><a href="https://github.com/deepkit/deepkit-framework" rel="nofollow"><img src="https://img.shields.io/github/stars/deepkit/deepkit-framework?style=social" alt="GitHub stars"></a></td>
    <td align="center">🧐</td>
    <td align="center">🧐</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/deepkit">@typeschema/deepkit</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/deepkit" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/deepkit.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/pelotom/runtypes" rel="nofollow">runtypes</a></nobr></td>
    <td align="left"><a href="https://github.com/pelotom/runtypes" rel="nofollow"><img src="https://img.shields.io/github/stars/pelotom/runtypes?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/runtypes">@typeschema/runtypes</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/runtypes" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/runtypes.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/icebob/fastest-validator" rel="nofollow">fastest-validator</a></nobr></td>
    <td align="left"><a href="https://github.com/icebob/fastest-validator" rel="nofollow"><img src="https://img.shields.io/github/stars/icebob/fastest-validator?style=social" alt="GitHub stars"></a></td>
    <td align="center">🧐</td>
    <td align="center">🧐</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/fastest-validator">@typeschema/fastest-validator</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/fastest-validator" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/fastest-validator.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://vinejs.dev" rel="nofollow">vine</a></nobr></td>
    <td align="left"><a href="https://github.com/vinejs/vine" rel="nofollow"><img src="https://img.shields.io/github/stars/vinejs/vine?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/vine">@typeschema/vine</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/vine" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/vine.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/grantila/suretype" rel="nofollow">suretype</a></nobr></td>
    <td align="left"><a href="https://github.com/grantila/suretype" rel="nofollow"><img src="https://img.shields.io/github/stars/grantila/suretype?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/suretype">@typeschema/suretype</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/suretype" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/suretype.svg?label=" alt="npm downloads"></a></td>
  </tr>
  <tr>
    <td align="left"><nobr><a href="https://github.com/badrap/valita" rel="nofollow">valita</a></nobr></td>
    <td align="left"><a href="https://github.com/badrap/valita" rel="nofollow"><img src="https://img.shields.io/github/stars/badrap/valita?style=social" alt="GitHub stars"></a></td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">✅</td>
    <td align="center">🧐</td>
    <td align="left"><nobr><code><a href="https://github.com/decs/typeschema/tree/main/packages/valita">@typeschema/valita</a></code></nobr></td>
    <td align="right"><a href="https://www.npmjs.com/package/@typeschema/valita" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/valita.svg?label=" alt="npm downloads"></a></td>
  </tr>
</table>

> [!NOTE]
> Don't see your favorite validation library?
> We welcome [PRs](https://github.com/decs/typeschema/pulls)!
> Otherwise, please [file an issue](https://github.com/decs/typeschema/issues) to help us prioritize. 🙌

## API

### Inference
- `Infer<TSchema>`: Extracts the output type of a schema
- `InferIn<TSchema>`: Extracts the input type of a schema

### Validation
- `wrap(schema)`: Returns the wrapped schema with access to its operations
- `validate(schema, data)`: Returns the validated data or a list of validation issues
- `assert(schema, data)`: Returns the validated data or throws an `AggregateError`

### Serialization
- `toJSONSchema(schema)`: Converts the schema into the equivalent JSON schema (Requires the peer dev dependency @types/json-schema to be installed.)

## Acknowledgements

- Inspired by [tRPC](https://trpc.io/)'s [input & output validators](https://trpc.io/docs/server/validators)
- Adapter architecture inspired by [@ecyrbe](https://github.com/ecyrbe)'s [suggestions](https://github.com/decs/typeschema/issues/1)
- API definition inspired by [@colinhacks](https://github.com/colinhacks)'s [proposal](https://twitter.com/colinhacks/status/1634284724796661761)
- Logo designed by [flaticon](https://www.flaticon.com/)
