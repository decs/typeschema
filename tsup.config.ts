import type {Plugin} from 'esbuild';

import fs from 'node:fs';

import {defineConfig} from 'tsup';

const dynamicImportsPlugin: Plugin = {
  name: 'dynamicImports',
  setup(build) {
    build.onLoad({filter: /\.ts$/}, async args => ({
      contents: fs.readFileSync(args.path, 'utf-8').replace(
        /([ \t]*)const (\w+|{.+}) = await import\((.*)\);\s*return ([^;]+);/g,
        `$1try {
$1  const $2 = await import(/* webpackIgnore: true */ $3);
$1  return $4;
$1} catch (error) {
$1  throw error;
$1}`,
      ),
      loader: 'ts',
    }));
  },
};

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts'],
  esbuildPlugins: [dynamicImportsPlugin],
  format: ['esm', 'cjs'],
});
