import {initTRPC} from '@trpc/server';

import {wrap} from '..';

const schema = {
  type: 'object',
  properties: {name: {type: 'string'}},
  required: ['name'],
  additionalProperties: false,
};

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${(input as any).name}!`),
  //         ^? unknown
});
