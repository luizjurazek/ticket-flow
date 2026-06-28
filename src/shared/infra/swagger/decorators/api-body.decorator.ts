import 'reflect-metadata';
import { METADATA_KEYS } from '@/shared/infra/swagger/metadata/metadata.constants';
import { ApiBodyMetadata } from '@/shared/infra/swagger/types/api-body.type';

export function ApiBody(metadata: ApiBodyMetadata) {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(METADATA_KEYS.BODY, metadata, target, propertyKey);
  };
}
