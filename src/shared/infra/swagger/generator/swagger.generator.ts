import { ExploredEndpoint } from '@swagger/types/explored-endpoint.type';
import { DEFAULT_RESPONSES } from '@swagger/defaults/default-response';
import { DtoToSchema } from '@swagger/utils/dto-to-schema.util';

interface SwaggerTag {
  name: string;
}

export class SwaggerGenerator {
  generate(endpoints: ExploredEndpoint[]) {
    return {
      paths: this.generatePaths(endpoints),
      tags: this.collectTags(endpoints),
    };
  }

  private generatePaths(endpoints: ExploredEndpoint[]) {
    const paths: Record<string, any> = {};

    for (const endpoint of endpoints) {
      if (!endpoint.route) {
        continue;
      }

      const path = endpoint.route.path;

      if (!paths[path]) {
        paths[path] = {};
      }

      const responses: Record<string, any> = {
        ...DEFAULT_RESPONSES[endpoint.route.method],
      };

      for (const response of endpoint.responses ?? []) {
        const responseEntry: { description: string; content?: Record<string, unknown> } = {
          description: response.description,
        };
        if (response.type) {
          const schema = DtoToSchema.parse(response.type);
          responseEntry.content = {
            'application/json': {
              schema: response.isArray ? { type: 'array', items: schema } : schema,
            },
          };
        }
        responses[response.statusCode] = responseEntry;
      }

      paths[path][endpoint.route.method] = {
        summary: endpoint.operation?.summary,
        description: endpoint.operation?.description,

        ...(endpoint.tags?.length && {
          tags: endpoint.tags,
        }),

        ...(endpoint.params?.length && {
          parameters: endpoint.params.map((param) => ({
            name: param.name,
            in: param.in,
            description: param.description,
            required: param.required ?? param.in === 'path',
            schema: { type: param.type ?? 'string' },
          })),
        }),

        ...(endpoint.body && {
          requestBody: {
            description: endpoint.body.description,
            required: endpoint.body.required ?? true,
            content: {
              'application/json': {
                schema: DtoToSchema.parse(endpoint.body.type),
              },
            },
          },
        }),

        responses,
      };
    }

    return paths;
  }

  private collectTags(endpoints: ExploredEndpoint[]): SwaggerTag[] {
    const tagNames = new Set<string>();

    for (const endpoint of endpoints) {
      endpoint.tags?.forEach((tag) => tagNames.add(tag));
    }

    return [...tagNames].sort().map((name) => ({ name }));
  }
}
