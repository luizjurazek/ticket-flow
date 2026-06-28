import 'reflect-metadata';
import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';

export function ApiProperty(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    const type = Reflect.getMetadata('design:type', target, propertyKey);

    const existing: { key: string | symbol; type: any }[] = Reflect.getMetadata(METADATA_KEYS.PROPERTY, target) ?? [];

    Reflect.defineMetadata(METADATA_KEYS.PROPERTY, [...existing, { key: propertyKey, type }], target);
  };
}
