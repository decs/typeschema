import {deepkitType} from '@deepkit/vite';
import typescript from 'rollup-plugin-typescript2';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  esbuild: false,
  plugins: [
    typescript({
      tsconfig: './tsconfig.test.json',
      exclude: './**/deepkit.test.ts',
    }),
    deepkitType({
      tsConfig: './tsconfig.test.json',
      include: './**/deepkit.test.ts',
    }),
  ],
  test: {watch: false},
});
