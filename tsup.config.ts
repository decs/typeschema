import type {Plugin} from 'esbuild';

import fs from 'node:fs';

import {
  anyOf,
  char,
  createRegExp,
  exactly,
  global,
  maybe,
  multiline,
  oneOrMore,
  whitespace,
  wordChar,
} from 'magic-regexp';
import {defineConfig} from 'tsup';

const regex = createRegExp(
  maybe(oneOrMore(whitespace)).groupedAs('indentation'),
  anyOf('const', 'let', 'var').groupedAs('declarationType'),
  oneOrMore(whitespace),
  oneOrMore(wordChar).or('{', oneOrMore(char), '}').groupedAs('variableName'),
  oneOrMore(whitespace),
  '=',
  oneOrMore(whitespace),
  maybe('await', oneOrMore(whitespace)).groupedAs('await'),
  'import(',
  maybe(oneOrMore(whitespace)),
  exactly("'", oneOrMore(char), "'")
    .or('"', oneOrMore(char), '"')
    .groupedAs('modulePath'),
  maybe(oneOrMore(whitespace)),
  ')',
  maybe(';').groupedAs('terminator'),
  [global, multiline],
);
const template = `
try {
  var dynamicallyImportedModule = $<await>import(
    /* webpackIgnore: true */
    $<modulePath>
  )$<terminator>
} catch (moduleImportError) {
  throw moduleImportError$<terminator>
}
$<declarationType> $<variableName> = dynamicallyImportedModule$<terminator>
`.trim();

const optionalPeerDependenciesPlugin: Plugin = {
  name: 'optionalPeerDependencies',
  setup(build) {
    build.onLoad({filter: /\.ts$/}, async args => ({
      contents: fs.readFileSync(args.path, 'utf-8').replace(regex, template),
      loader: 'ts',
    }));
  },
};

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  esbuildPlugins: [optionalPeerDependenciesPlugin],
  format: ['esm', 'cjs'],
});
