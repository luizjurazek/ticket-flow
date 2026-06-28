import 'reflect-metadata';

import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { ApiRouteMetadata } from '@swagger/types/api-route.type';

export function ApiRoute(metadata: ApiRouteMetadata) {
  return (target: object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(METADATA_KEYS.ROUTE, metadata, target, propertyKey);
  };
}
