import type {Resolver} from '../resolver';
import type {Adapter} from '.';
import type {AnySchema} from 'joi';

import {isJSONSchema, isTypeBoxSchema} from '../utils';
import {ValidationIssue} from '../validation';

export interface JoiResolver extends Resolver {
  base: AnySchema<this['type']>;
}

export const coerce: Adapter<'joi'>['coerce'] = schema =>
  '_flags' in schema && !isTypeBoxSchema(schema) && !isJSONSchema(schema)
    ? schema
    : null;

export const createValidate: Adapter<'joi'>['createValidate'] =
  async schema => {
    const coercedSchema = coerce(schema);
    if (coercedSchema == null) {
      return undefined;
    }
    return async data => {
      const result = coercedSchema.validate(data);
      if (result.error == null) {
        return {data: result.value};
      }
      return {
        issues: result.error.details.map(
          ({message, path}) => new ValidationIssue(message, path),
        ),
      };
    };
  };
