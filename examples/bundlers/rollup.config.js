import nodeResolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.ts',
  output: {dir: 'rollup_dist'},
  plugins: [nodeResolve()],
};
