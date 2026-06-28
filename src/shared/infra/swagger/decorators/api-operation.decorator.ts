import 'reflect-metadata';

import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { ApiOperationMetadata } from '@swagger/types/api-operation.type';

export function ApiOperation(metadata: ApiOperationMetadata) {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(METADATA_KEYS.OPERATION, metadata, target, propertyKey);
  };
}
