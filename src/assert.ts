import type {Schema} from './types';

export async function assert<T>(schema: Schema<T>, data: unknown): Promise<T> {
  if ('create' in schema) {
    return schema.create(data);
  }
  if ('assert' in schema) {
    return schema.assert(data);
  }
  if ('check' in schema) {
    return schema.check(data);
  }
  if ('validateAsync' in schema) {
    return schema.validateAsync(data);
  }
  if ('validate' in schema) {
    return schema.validate(data, {strict: true});
  }
  if ('parse' in schema) {
    return schema.parse(data);
  }
  return schema(data);
}
