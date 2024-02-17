<!-- This file is generated. Do not modify it manually! -->

<img src="https://typeschema.com/assets/logo.png" width="64px" alt="TypeSchema" />
<h1>@typeschema/all</h1>
<p>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow"><img src="https://img.shields.io/github/license/decs/typeschema" alt="License"></a>
  <a href="https://bundlephobia.com/package/@typeschema/all" rel="nofollow"><img src="https://img.shields.io/bundlephobia/minzip/%40typeschema%2Fall" alt="Bundle size"></a>
  <a href="https://www.npmjs.com/package/@typeschema/all" rel="nofollow"><img src="https://img.shields.io/npm/dw/@typeschema/all.svg" alt="npm downloads"></a>
  <a href="https://github.com/decs/typeschema/stargazers" rel="nofollow"><img src="https://img.shields.io/github/stars/decs/typeschema" alt="GitHub stars"></a>
</p>
<p>
  Universal adapter for schema validation
  <br />
  <a href="https://typeschema.com">https://typeschema.com</a> ✨
</p>

## Setup

<table>
  <tr>
    <th>npm</th>
    <td><code>npm install @typeschema/all</code></td>
  </tr>
  <tr>
    <th>Yarn</th>
    <td><code>yarn add @typeschema/all</code></td>
  </tr>
  <tr>
    <th>pnpm</th>
    <td><code>pnpm add @typeschema/all</code></td>
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
