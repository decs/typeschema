import {validate} from '@typeschema/all';
import ow from 'ow';

validate(ow.string, 'hello').then(console.log);
