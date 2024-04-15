import * as fs from 'fs';

import {maybeReadFile} from './config';

const STARS_PATH = 'turbo/generators/stars.json';
const CACHE_DURATION_IN_SEC = 7200;

const LIBRARIES: Record<
  string,
  {adapterName?: string; github: string; url: string}
> = {
  ajv: {
    adapterName: 'json',
    github: 'ajv-validator/ajv',
    url: 'https://ajv.js.org',
  },
  arktype: {
    github: 'arktypeio/arktype',
    url: 'https://arktype.io',
  },
  'class-validator': {
    github: 'typestack/class-validator',
    url: 'https://github.com/typestack/class-validator',
  },
  deepkit: {
    github: 'deepkit/deepkit-framework',
    url: 'https://deepkit.io',
  },
  effect: {
    github: 'effect-ts/effect',
    url: 'https://effect.website',
  },
  'fastest-validator': {
    github: 'icebob/fastest-validator',
    url: 'https://github.com/icebob/fastest-validator',
  },
  'io-ts': {
    github: 'gcanti/io-ts',
    url: 'https://gcanti.github.io/io-ts',
  },
  joi: {
    github: 'hapijs/joi',
    url: 'https://joi.dev',
  },
  ow: {
    github: 'sindresorhus/ow',
    url: 'https://sindresorhus.com/ow',
  },
  runtypes: {
    github: 'pelotom/runtypes',
    url: 'https://github.com/pelotom/runtypes',
  },
  superstruct: {
    github: 'ianstormtaylor/superstruct',
    url: 'https://docs.superstructjs.org',
  },
  suretype: {
    github: 'grantila/suretype',
    url: 'https://github.com/grantila/suretype',
  },
  typebox: {
    github: 'sinclairzx81/typebox',
    url: 'https://github.com/sinclairzx81/typebox',
  },
  typia: {
    adapterName: 'function',
    github: 'samchon/typia',
    url: 'https://typia.io',
  },
  valibot: {
    github: 'fabian-hiller/valibot',
    url: 'https://valibot.dev',
  },
  valita: {
    github: 'badrap/valita',
    url: 'https://github.com/badrap/valita',
  },
  vine: {
    github: 'vinejs/vine',
    url: 'https://vinejs.dev',
  },
  yup: {
    github: 'jquense/yup',
    url: 'https://github.com/jquense/yup',
  },
  zod: {
    github: 'colinhacks/zod',
    url: 'https://zod.dev',
  },
};

async function genStars() {
  const cachedResult: Record<string, number> = JSON.parse(
    maybeReadFile(STARS_PATH) ?? '{}',
  );
  const updateTime = Math.round(Date.now() / 1000);
  if (
    updateTime - (cachedResult.updateTime ?? 0) <= CACHE_DURATION_IN_SEC &&
    Object.values(LIBRARIES).every(({github}) => cachedResult[github] != null)
  ) {
    return cachedResult;
  }
  const result: Record<string, number> = {updateTime};
  await Promise.all(
    Object.values(LIBRARIES).map(async ({github}) => {
      const response = await fetch(`https://api.github.com/repos/${github}`);
      const data = await response.json();
      if (data.message != null) {
        throw new Error(data.message);
      }
      result[github] = data.stargazers_count;
    }),
  );
  fs.writeFileSync(STARS_PATH, JSON.stringify(result, null, 2));
  return result;
}

export async function genLibraries(adapters: Record<string, unknown>) {
  const stars = await genStars();
  const result = await Promise.all(
    Object.keys(LIBRARIES).map(async name => ({
      ...LIBRARIES[name],
      adapter: adapters[LIBRARIES[name]?.adapterName ?? name],
      name,
      stars: stars[LIBRARIES[name]?.github ?? ''] ?? 0,
    })),
  );
  return result.sort((a, b) => b.stars - a.stars);
}
