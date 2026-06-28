import 'reflect-metadata';

export class MetadataReader {
  static get<T>(key: symbol, target: object, propertyKey: string): T | undefined {
    return Reflect.getMetadata(key, target, propertyKey);
  }
}
