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
            .map(field => field.replace(/^\/\//, ''));
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
  return adapterNames.map(adapterName => ({
    name: adapterName,
    packageJson: JSON.parse(
      fs.readFileSync(`packages/${adapterName}/package.json`, 'utf-8'),
    ),
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
    example: maybeReadFile(
      `packages/${adapterName}/src/__tests__/example.ts`,
    )?.replace("'..'", `'@typeschema/${adapterName}'`),
  }));
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

  plop.setGenerator('all', {
    actions: () => {
      const packageFiles = fs
        .readdirSync('packages', {recursive: true})
        .map(String)
        .filter(filePath => !filePath.includes('/node_modules/'));
      const packageNames = packageFiles
        .filter(filePath => filePath.endsWith('/package.json'))
        .map(filePath => filePath.replace(/\/package\.json$/, ''));
      const adapters = getAdapters(
        packageNames.filter(
          packageName => !['core', 'typeschema'].includes(packageName),
        ),
      );
      const multiAdapterNames = ['main', 'all'];
      const singleAdapters = adapters.filter(
        adapter => !multiAdapterNames.includes(adapter.name),
      );
      const actions: Array<PlopTypes.ActionConfig> = [
        ...adapters.flatMap(adapter =>
          getAddActions({
            data: adapter,
            base: 'templates/adapter',
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
