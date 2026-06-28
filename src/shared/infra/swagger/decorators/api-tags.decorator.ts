import 'reflect-metadata';

import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { ApiTagsMetadata } from '@swagger/types/api-tags.type';

export function ApiTags(...tags: ApiTagsMetadata) {
  return (target: object, propertyKey?: string | symbol) => {
    if (propertyKey !== undefined) {
      Reflect.defineMetadata(METADATA_KEYS.TAGS, tags, target, propertyKey);
      return;
    }

    Reflect.defineMetadata(METADATA_KEYS.TAGS, tags, target);
  };
}
