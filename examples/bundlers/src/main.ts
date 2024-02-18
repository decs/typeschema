import {validate} from '@typeschema/main';
import {z} from 'zod';

validate(z.string(), 'hello').then(console.log);
