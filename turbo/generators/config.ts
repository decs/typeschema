import type {PlopTypes} from '@turbo/gen';

export const adapterNames = ['valibot', 'zod'];

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('adapters', {
    actions: [
      ...adapterNames.flatMap(adapterName => [
        {
          force: true,
          path: 'packages/' + adapterName + '/src/index.ts',
          templateFile: 'templates/index.ts.hbs',
          type: 'add',
        },
      ]),
    ],
    description: 'Generator description',
    prompts: [],
  });
}
