import process from "node:node:process";
const __dirname = (() => {
    const { url: urlStr } = import.meta;
    const url = new URL(urlStr);
    const __filename = (url.protocol === "file:" ? url.pathname : urlStr)
        .replace(/[/][^/]*$/, '');

    const isWindows = (() => {

        let NATIVE_OS: typeof Deno.build.os = "linux";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const navigator = (globalThis as any).navigator;
        if (globalThis.Deno != null) {
            NATIVE_OS = Deno.build.os;
        } else if (navigator?.appVersion?.includes?.("Win") ?? false) {
            NATIVE_OS = "windows";
        }

        return NATIVE_OS == "windows";

    })();

    return isWindows ?
        __filename.split("/").join("\\").substring(1) :
        __filename;
})();

import type {Plugin} from 'npm:vite@4.4.9';

import * as path from 'node:path';
import {mergeConfig} from 'npm:vite@4.4.9';

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
