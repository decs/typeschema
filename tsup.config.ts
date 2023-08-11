import {defineConfig} from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/vite/index.ts', 'src/vite/placeholder.ts'],
  format: ['esm', 'cjs'],
  tsconfig: 'tsconfig.build.json',
});
