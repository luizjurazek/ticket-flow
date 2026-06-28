import 'reflect-metadata';
import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { ApiParamMetadata } from '@swagger/types/api-params.type';

export function ApiParams(metadata: ApiParamMetadata) {
  return (target: object, propertyKey: string | symbol) => {
    const existing = Reflect.getMetadata(METADATA_KEYS.PARAMS, target, propertyKey) ?? [];

    Reflect.defineMetadata(METADATA_KEYS.PARAMS, [...existing, metadata], target, propertyKey);
  };
}
