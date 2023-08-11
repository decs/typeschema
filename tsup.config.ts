import {defineConfig} from 'tsup';

export default defineConfig([
  {
    clean: true,
    dts: true,
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    onSuccess: "sed -i '' 's/import/require/g' dist/index.js",
  },
  {
    clean: true,
    dts: true,
    entry: ['src/vite/index.ts', 'src/vite/placeholder.ts'],
    format: 'cjs',
    outDir: 'vite',
  },
]);
