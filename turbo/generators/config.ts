import type {PlopTypes} from '@turbo/gen';

import {ESLint} from 'eslint';
import * as fs from 'fs';
import * as prettier from 'prettier';

const DISCLAIMER = 'This file is generated. Do not modify it manually!';
const PARTIAL_DISCLAIMER =
  'This file is partially generated. Only some fields can be modified manually!';

const SLASH_STAR_HEADER = `/**
 * ${DISCLAIMER}
 */`;
const HASH_HEADER = `# ${DISCLAIMER}`;
const HTML_HEADER = `<!-- ${DISCLAIMER} -->`;

const eslint = new ESLint({
  fix: true,
  overrideConfig: {parserOptions: {extraFileExtensions: ['.tmp']}},
});

const generatedFilePaths: Array<string> = [];

function maybeReadFile(path: string): string | null {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf-8') : null;
}

function getAddAction(config: {
  data?: object;
  path: string;
  templateFile: string;
}): PlopTypes.AddActionConfig {
  const originalContent = config.path.endsWith('.json')
    ? maybeReadFile(config.path)
    : null;
  return {
    force: true,
    transform: async (content: string) => {
      switch (config.path.split('.').pop()) {
        case 'ts':
          const tempPath = `${config.path}.tmp`;
          fs.writeFileSync(tempPath, `${SLASH_STAR_HEADER}\n\n${content}`);
          const results = await eslint.lintFiles(tempPath);
          const output =
            results[0].output ?? fs.readFileSync(tempPath, 'utf-8');
          fs.unlinkSync(tempPath);
          generatedFilePaths.push(config.path);
          return output;
        case 'json':
          let object = JSON.parse(content.replace(/,(\s+[\}\]\)])/g, '$1'));
          const manualFields = Object.keys(object)
            .filter(field => field.startsWith('//'))
            .flatMap(field => [field, field.replace(/^\/\//, '')]);
          if (manualFields.length > 0 && originalContent != null) {
            const originalObject = JSON.parse(originalContent);
            manualFields
              .filter(field => originalObject[field] != null)
              .forEach(field => (object[field] = originalObject[field]));
          }
          object = {
            '//': manualFields.length > 0 ? PARTIAL_DISCLAIMER : DISCLAIMER,
            ...object,
          };
          if (manualFields.length === 0) {
            generatedFilePaths.push(config.path);
          }
          return prettier.format(JSON.stringify(object), {
            filepath: config.path,
            trailingComma: 'none',
          });
        case 'md':
          generatedFilePaths.push(config.path);
          return `${HTML_HEADER}\n\n${content}`;
        default:
          generatedFilePaths.push(config.path);
          return `${HASH_HEADER}\n\n${content}`;
      }
    },
    type: 'add',
    ...config,
  };
}

function getAddActions(config: {
  base: string;
  destination: string;
  data?: object;
}): Array<PlopTypes.AddActionConfig> {
  return fs
    .readdirSync(`turbo/generators/${config.base}`, {recursive: true})
    .map(String)
    .filter(filePath => filePath.endsWith('.hbs'))
    .map(filePath =>
      getAddAction({
        data: config.data,
        path: `${config.destination}/${filePath.replace(/\.hbs$/, '')}`,
        templateFile: `${config.base}/${filePath}`,
      }),
    );
}

function getAdapters(adapterNames: Array<string>) {
  return adapterNames.map(adapterName => {
    const resolver = maybeReadFile(`packages/${adapterName}/src/resolver.ts`);
    return {
      canInfer: ['input', 'output'].reduce(
        (result, type) => ({
          ...result,
          [type]:
            resolver?.includes(
              `${type}: this['schema'] extends this['base'] ? unknown : never;`,
            ) === false,
        }),
        {},
      ),
      example: maybeReadFile(
        `packages/${adapterName}/src/__tests__/example.ts`,
      )?.replace("'..'", `'@typeschema/${adapterName}'`),
      hasModule: ['validation', 'serialization'].reduce(
        (result, moduleName) => ({
          ...result,
          [moduleName]:
            fs.statSync(`packages/${adapterName}/src/${moduleName}.ts`, {
              throwIfNoEntry: false,
            }) != null,
        }),
        {},
      ),
      name: adapterName,
      packageJson: JSON.parse(
        maybeReadFile(`packages/${adapterName}/package.json`) ?? '{}',
      ),
    };
  });
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType('list', () => {
    const content = generatedFilePaths
      .concat(['.gitattributes', 'pnpm-lock.yaml'])
      .sort()
      .map(path => `${path} linguist-generated`)
      .join('\n');
    fs.writeFileSync('.gitattributes', `${HASH_HEADER}\n\n${content}`);
    return '.gitattributes';
  });

  plop.setPartial(
    'packageJson',
    fs.readFileSync('turbo/generators/templates/package.json.hbs', 'utf-8'),
  );
  plop.setPartial(
    'readmeAPI',
    fs.readFileSync('turbo/generators/templates/README-api.md.hbs', 'utf-8'),
  );

  plop.addHelper('icon', (value: boolean) => (value ? '✅' : '🧐'));
  plop.addHelper('isEmpty', (value: object) => Object.keys(value).length === 0);

  plop.setGenerator('all', {
    actions: () => {
      const packageNames = fs
        .readdirSync('packages', {withFileTypes: true})
        .filter(file => file.isDirectory())
        .map(file => file.name);
      const adapters = getAdapters(
        packageNames.filter(packageName => packageName !== 'core'),
      );
      const multiAdapterNames = ['main', 'all'];
      const singleAdapters = adapters.filter(
        adapter => !multiAdapterNames.includes(adapter.name),
      );
      const actions: Array<PlopTypes.ActionConfig> = [
        ...adapters.flatMap(adapter =>
          getAddActions({
            base: 'templates/adapter',
            data: {
              ...adapter,
              isMultipleAdapter: multiAdapterNames.includes(adapter.name),
            },
            destination: `packages/${adapter.name}`,
          }),
        ),
        ...multiAdapterNames.flatMap(multiAdapterName => [
          ...getAddActions({
            base: `templates/${multiAdapterName}`,
            data: {adapters: singleAdapters},
            destination: `packages/${multiAdapterName}`,
          }),
          ...singleAdapters.map(singleAdapter =>
            getAddAction({
              path: `packages/${multiAdapterName}/src/__tests__/${singleAdapter.name}.test.ts`,
              templateFile: `../../packages/${singleAdapter.name}/src/__tests__/${singleAdapter.name}.test.ts`,
            }),
          ),
        ]),
        getAddAction({
          path: 'packages/core/tsconfig.json',
          templateFile: 'templates/adapter/tsconfig.json.hbs',
        }),
        getAddAction({
          data: {
            adapter: adapters.find(adapter => adapter.name === 'main'),
            libraries: [
              {
                adapter: adapters.find(adapter => adapter.name === 'zod'),
                github: 'colinhacks/zod',
                name: 'zod',
                url: 'https://zod.dev',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'yup'),
                github: 'jquense/yup',
                name: 'yup',
                url: 'https://github.com/jquense/yup',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'joi'),
                github: 'hapijs/joi',
                name: 'joi',
                url: 'https://joi.dev',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'json'),
                github: 'ajv-validator/ajv',
                name: 'ajv',
                url: 'https://ajv.js.org',
              },
              {
                adapter: adapters.find(
                  adapter => adapter.name === 'class-validator',
                ),
                github: 'typestack/class-validator',
                name: 'class-validator',
                url: 'https://github.com/typestack/class-validator',
              },
              {
                adapter: adapters.find(
                  adapter => adapter.name === 'superstruct',
                ),
                github: 'ianstormtaylor/superstruct',
                name: 'superstruct',
                url: 'https://docs.superstructjs.org',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'io-ts'),
                github: 'gcanti/io-ts',
                name: 'io-ts',
                url: 'https://gcanti.github.io/io-ts',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'valibot'),
                github: 'fabian-hiller/valibot',
                name: 'valibot',
                url: 'https://valibot.dev',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'typebox'),
                github: 'sinclairzx81/typebox',
                name: 'typebox',
                url: 'https://github.com/sinclairzx81/typebox',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'function'),
                github: 'samchon/typia',
                name: 'typia',
                url: 'https://typia.io',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'ow'),
                github: 'sindresorhus/ow',
                name: 'ow',
                url: 'https://sindresorhus.com/ow',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'effect'),
                github: 'effect-ts/effect',
                name: 'effect',
                url: 'https://effect.website',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'arktype'),
                github: 'arktypeio/arktype',
                name: 'arktype',
                url: 'https://arktype.io',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'deepkit'),
                github: 'deepkit/deepkit-framework',
                name: 'deepkit',
                url: 'https://deepkit.io',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'runtypes'),
                github: 'pelotom/runtypes',
                name: 'runtypes',
                url: 'https://github.com/pelotom/runtypes',
              },
              {
                adapter: adapters.find(
                  adapter => adapter.name === 'fastest-validator',
                ),
                github: 'icebob/fastest-validator',
                name: 'fastest-validator',
                url: 'https://github.com/icebob/fastest-validator',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'vine'),
                github: 'vinejs/vine',
                name: 'vine',
                url: 'https://vinejs.dev',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'suretype'),
                github: 'grantila/suretype',
                name: 'suretype',
                url: 'https://github.com/grantila/suretype',
              },
              {
                adapter: adapters.find(adapter => adapter.name === 'valita'),
                github: 'badrap/valita',
                name: 'valita',
                url: 'https://github.com/badrap/valita',
              },
            ],
          },
          path: 'README.md',
          templateFile: 'templates/README.md.hbs',
        }),
      ].sort((a, b) => a.path.localeCompare(b.path));
      actions.push({type: 'list'});
      return actions;
    },
    description: 'Re-generates files',
    prompts: [],
  });

  plop.setGenerator('create-adapter', {
    actions: [
      {
        base: 'templates/create-adapter',
        destination: 'packages/{{adapterName}}',
        force: true,
        templateFiles: 'templates/create-adapter',
        type: 'addMany',
      },
    ],
    description: 'Initializes an adapter package',
    prompts: [
      {
        message: 'Adapter name',
        name: 'adapterName',
        type: 'input',
      },
    ],
  });
}
