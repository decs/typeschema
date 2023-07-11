import type {Schema, WrappedSchema} from '../registry';

export type Adapter = <T>(
  schema: Schema<T>,
) => Promise<WrappedSchema<T> | null>;

import './arktype';
import './function';
import './joi';
import './runtypes';
import './superstruct';
import './typebox';
import './yup';
import './zod';
