import {validate, toJSONSchema} from '@typeschema/all';
import ow from 'ow';

validate(ow.string, 'hello').then(console.log);

toJSONSchema(ow.string)
  .then(() => {
    throw new Error('Unexpected success');
  })
  .catch(error => {
    if (!error.message.startsWith('Unsupported')) {
      throw new Error(`Unexpected error: ${error.message}`);
    }
  });
