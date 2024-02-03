import type {PlopTypes} from '@turbo/gen';

import * as fs from 'node:fs';
import * as path from 'node:path';

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
    ...adapterNames.map(adapterName => ({
      force: true,
      path: `packages/${adapterName}/src/index.ts`,
      templateFile: 'templates/index.ts.hbs',
      type: 'add',
    })),
    {
      data: {adapterNames: adapterNamesExcludingMain},
      force: true,
      path: `packages/main/src/resolver.ts`,
      templateFile: 'templates/resolver.ts.hbs',
      type: 'add',
    },
    {
      data: {adapterNames: adapterNamesExcludingMain},
      force: true,
      path: `packages/main/src/validation.ts`,
      templateFile: 'templates/validation.ts.hbs',
      type: 'add',
    },
    ...adapterNamesExcludingMain.map(adapterName => ({
      force: true,
      path: `packages/main/src/__tests__/${adapterName}.test.ts`,
      templateFile: `../../packages/${adapterName}/src/__tests__/${adapterName}.test.ts`,
      type: 'add',
    })),
  ];

  plop.setGenerator('adapters', {
    actions: [
      ...actions,
      {
        data: {generatedFiles: actions.map(action => action.path)},
        force: true,
        path: '.gitattributes',
        templateFile: 'templates/.gitattributes.hbs',
        type: 'add',
      },
    ],
    description: 'Generates common adapter files',
    prompts: [],
  });
}
