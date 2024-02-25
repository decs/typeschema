import {deepkitType} from '@deepkit/vite';
import typescript from 'rollup-plugin-typescript2';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  esbuild: false,
  plugins: [
    typescript({
      exclude: './**/deepkit.test.ts',
      tsconfig: './src/__tests__/tsconfig.json',
    }),
    deepkitType({
      include: './**/deepkit.test.ts',
      tsConfig: './src/__tests__/tsconfig.json',
    }),
  ],
  test: {watch: false},
});
