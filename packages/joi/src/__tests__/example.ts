import {initTRPC} from '@trpc/server';
import Joi from 'joi';

import {wrap} from '..';

const schema = Joi.object({name: Joi.string().required()});

const t = initTRPC.create();
const appRouter = t.router({
  hello: t.procedure
    .input(wrap(schema))
    .query(({input}) => `Hello, ${(input as any).name}!`),
  //         ^? unknown
});
