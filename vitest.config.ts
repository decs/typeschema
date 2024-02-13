import {defineConfig} from 'vitest/config';
import typescript from 'rollup-plugin-typescript2';

export default defineConfig({
  esbuild: false,
  plugins: [typescript({tsconfig: './tsconfig.test.json'})],
  test: {watch: false},
});
