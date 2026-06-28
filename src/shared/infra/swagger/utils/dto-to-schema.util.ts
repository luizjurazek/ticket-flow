import 'reflect-metadata';
import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { ApiPropertyMetadata } from '@swagger/types/api-property.type';

export class DtoToSchema {
  static parse(dto: any) {
    const prototype = dto.prototype;

    const schema: Record<string, any> = {
      type: 'object',
      properties: {},
    };

    const props: ApiPropertyMetadata[] = Reflect.getMetadata(METADATA_KEYS.PROPERTY, prototype) ?? [];

    for (const { key, type } of props) {
      if (!type) continue;
      schema.properties[String(key)] = this.mapType(type.name);
    }

    return schema;
  }

  private static mapType(type: string) {
    switch (type) {
      case 'String':
        return { type: 'string' };
      case 'Number':
        return { type: 'number' };
      case 'Boolean':
        return { type: 'boolean' };
      case 'Date':
        return { type: 'string', format: 'date-time' };
      default:
        return { type: 'string' };
    }
  }
}
