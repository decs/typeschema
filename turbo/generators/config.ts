import type {PlopTypes} from '@turbo/gen';

import * as fs from 'node:fs';
import * as path from 'node:path';

const TYPESCRIPT_HEADER = `/**
 * This file is generated. Do not modify it manually!
 */`;
const FILE_HEADER = `# This file is generated. Do not modify it manually!`;

function generateFile(config: {
  path: string;
  templateFile: string;
  data?: object;
  includeHeader?: boolean;
}): PlopTypes.AddActionConfig {
  return {
    force: true,
    transform: (content: string) =>
      config.includeHeader ?? true
        ? `${
            config.path.endsWith('.ts') ? TYPESCRIPT_HEADER : FILE_HEADER
          }\n\n${content}`
        : content,
    type: 'add',
    ...config,
  };
}

const nonAdapterPackageNames = ['core', 'typeschema'];

function getPackageNames(plop: PlopTypes.NodePlopAPI): Array<string> {
  const packagesPath = path.join(plop.getDestBasePath(), 'packages');
  const packagesDir = fs.readdirSync(packagesPath, {withFileTypes: true});
  return packagesDir.filter(file => file.isDirectory()).map(file => file.name);
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  const packageNames = getPackageNames(plop);
  const adapterNames = packageNames.filter(
    packageName => !nonAdapterPackageNames.includes(packageName),
  );
  const adapterNamesExcludingMain = adapterNames.filter(
    adapterName => adapterName !== 'main',
  );

  const actions = [
    ...adapterNames.map(adapterName =>
      generateFile({
        path: `packages/${adapterName}/src/index.ts`,
        templateFile: 'templates/index.ts.hbs',
      }),
    ),
    generateFile({
      data: {adapterNames: adapterNamesExcludingMain},
      path: `packages/main/src/resolver.ts`,
      templateFile: 'templates/resolver.ts.hbs',
    }),
    generateFile({
      data: {adapterNames: adapterNamesExcludingMain},
      path: `packages/main/src/validation.ts`,
      templateFile: 'templates/validation.ts.hbs',
    }),
    ...adapterNamesExcludingMain.map(adapterName =>
      generateFile({
        path: `packages/main/src/__tests__/${adapterName}.test.ts`,
        templateFile: `../../packages/${adapterName}/src/__tests__/${adapterName}.test.ts`,
      }),
    ),
  ];
  plop.setGenerator('adapters', {
    actions: [
      ...actions,
      generateFile({
        data: {generatedFiles: actions.map(action => action.path)},
        path: '.gitattributes',
        templateFile: 'templates/.gitattributes.hbs',
      }),
    ],
    description: 'Generates common adapter files',
    prompts: [],
  });

  plop.setGenerator('create-adapter', {
    actions: [
      generateFile({
        includeHeader: false,
        path: 'packages/{{adapterName}}/package.json',
        templateFile: 'templates/create-adapter/package.json.hbs',
      }),
      generateFile({
        includeHeader: false,
        path: 'packages/{{adapterName}}/tsconfig.json',
        templateFile: 'templates/create-adapter/tsconfig.json.hbs',
      }),
      generateFile({
        includeHeader: false,
        path: 'packages/{{adapterName}}/src/resolver.ts',
        templateFile: 'templates/create-adapter/src/resolver.ts.hbs',
      }),
      generateFile({
        includeHeader: false,
        path: 'packages/{{adapterName}}/src/validation.ts',
        templateFile: 'templates/create-adapter/src/validation.ts.hbs',
      }),
      generateFile({
        includeHeader: false,
        path: 'packages/{{adapterName}}/src/__tests__/{{adapterName}}.test.ts',
        templateFile:
          'templates/create-adapter/src/__tests__/adapter.test.ts.hbs',
      }),
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
