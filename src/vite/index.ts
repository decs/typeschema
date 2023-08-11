import type {Plugin} from 'vite';

import * as path from 'path';
import {mergeConfig} from 'vite';

const optionalDependencies = [
  '@deepkit/type',
  '@sinclair/typebox/compiler',
  'ajv',
  'fp-ts/Either',
  'ow',
  'valibot',
  'yup',
];

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

export function typeschemaPlugin(): Plugin {
  return {
    config(config) {
      optionalDependencies.forEach(optionalDependency => {
        try {
          require.resolve(optionalDependency, {
            paths: [config.root || process.cwd()],
          });
        } catch (e) {
          if (isNodeError(e) && e.code === 'MODULE_NOT_FOUND') {
            config.resolve = mergeConfig(config.resolve ?? {}, {
              alias: {
                [optionalDependency]: path.resolve(__dirname, 'placeholder.js'),
              },
            });
          }
        }
      });
    },
    enforce: 'pre',
    name: 'vite-plugin-typeschema',
  };
}
