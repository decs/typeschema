import {toJSONSchema, validate} from '@typeschema/all';
import ow from 'ow';

validate(ow.string, 'hello').then(console.log);

toJSONSchema(ow.string)
  .then(() => {
    throw new Error('Unexpected success');
  })
  .catch(error => {
    if (error.message !== 'This feature is unsupported for @typeschema/ow') {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  });
