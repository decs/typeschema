import type {AjvResolver} from '../adapters/ajv';
import type {ArkTypeResolver} from '../adapters/arktype';
import type {CustomResolver} from '../adapters/custom';
import type {DeepkitResolver} from '../adapters/deepkit';
import type {IoTsResolver} from '../adapters/io-ts';
import type {JoiResolver} from '../adapters/joi';
import type {OwResolver} from '../adapters/ow';
import type {RuntypesResolver} from '../adapters/runtypes';
import type {SuperstructResolver} from '../adapters/superstruct';
import type {TypeBoxResolver} from '../adapters/typebox';
import type {ValibotResolver} from '../adapters/valibot';
import type {YupResolver} from '../adapters/yup';
import type {ZodResolver} from '../adapters/zod';

export interface TypeSchemaRegistry {
  ajv: AjvResolver;
  arktype: ArkTypeResolver;
  custom: CustomResolver;
  deepkit: DeepkitResolver;
  'io-ts': IoTsResolver;
  joi: JoiResolver;
  ow: OwResolver;
  runtypes: RuntypesResolver;
  superstruct: SuperstructResolver;
  typebox: TypeBoxResolver;
  valibot: ValibotResolver;
  yup: YupResolver;
  zod: ZodResolver;
}
