import type {Schema, TypeSchema} from '../registry';

export type Adapter = <T>(schema: Schema<T>) => Promise<TypeSchema<T> | null>;

import './arktype';
import './function';
import './joi';
import './runtypes';
import './superstruct';
import './typebox';
import './yup';
import './zod';
