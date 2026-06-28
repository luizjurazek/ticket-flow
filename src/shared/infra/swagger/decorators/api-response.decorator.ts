import 'reflect-metadata';
import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { ApiResponseMetadata } from '@swagger/types/api-response.type';

export function ApiResponse(metadata: ApiResponseMetadata) {
  return (target: object, propertyKey: string | symbol) => {
    const existing = Reflect.getMetadata(METADATA_KEYS.RESPONSE, target, propertyKey) ?? [];

    Reflect.defineMetadata(METADATA_KEYS.RESPONSE, [...existing, metadata], target, propertyKey);
  };
}
