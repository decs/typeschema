import type {PlopTypes} from '@turbo/gen';

import {ESLint} from 'eslint';
import * as fs from 'fs';
import * as prettier from 'prettier';

const DISCLAIMER = 'This file is generated. Do not modify it manually!';
const SLASH_STAR_HEADER = `/**
 * ${DISCLAIMER}
 */`;
const HASH_HEADER = `# ${DISCLAIMER}`;

const eslint = new ESLint({
  fix: true,
  overrideConfig: {parserOptions: {extraFileExtensions: ['.tmp']}},
});

function getAddAction(config: {
  data?: object;
  path: string;
  templateFile: string;
}): PlopTypes.AddActionConfig {
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
          return output;
        case 'json':
          return prettier.format(
            content.replace(/{/, `{"//": "${DISCLAIMER}",`),
            {filepath: config.path},
          );
        default:
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

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('all', {
    actions: () => {
      const packageNames = fs.readdirSync('packages').map(String);
      const adapterNames = packageNames.filter(
        packageName => !['core', 'typeschema'].includes(packageName),
      );
      const adapterNamesExcludingMain = adapterNames.filter(
        adapterName => adapterName !== 'main',
      );
      const actions = [
        ...adapterNames.flatMap(adapterName =>
          getAddActions({
            base: 'templates/adapter',
            destination: `packages/${adapterName}`,
          }),
        ),
        ...getAddActions({
          base: 'templates/main',
          data: {adapterNames: adapterNamesExcludingMain},
          destination: `packages/main`,
        }),
      ];
      actions.push(
        getAddAction({
          data: {generatedFilePaths: actions.map(action => action.path)},
          path: '.gitattributes',
          templateFile: 'templates/.gitattributes.hbs',
        }),
      );
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
