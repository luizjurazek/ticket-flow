import { METADATA_KEYS } from '@swagger/metadata/metadata.constants';
import { MetadataReader } from '@swagger/metadata/metadata.reader';
import { ExploredEndpoint } from '@swagger/types/explored-endpoint.type';
import { ApiRouteMetadata } from '@swagger/types/api-route.type';
import { ApiOperationMetadata } from '@swagger/types/api-operation.type';
import { ApiResponseMetadata } from '@swagger/types/api-response.type';
import { ApiBodyMetadata } from '@swagger/types/api-body.type';
import { ApiParamMetadata } from '@swagger/types/api-params.type';

export class SwaggerExplorer {
  explore(controller: object): ExploredEndpoint[] {
    const prototype = Object.getPrototypeOf(controller);
    const methods = Object.getOwnPropertyNames(prototype);

    return methods
      .filter((method) => method !== 'constructor')
      .map((method) => ({
        methodName: method,
        route: MetadataReader.get<ApiRouteMetadata>(METADATA_KEYS.ROUTE, prototype, method),
        operation: MetadataReader.get<ApiOperationMetadata>(METADATA_KEYS.OPERATION, prototype, method),
        responses: MetadataReader.get<ApiResponseMetadata[]>(METADATA_KEYS.RESPONSE, prototype, method),
        body: MetadataReader.get<ApiBodyMetadata>(METADATA_KEYS.BODY, prototype, method),
        params: MetadataReader.get<ApiParamMetadata[]>(METADATA_KEYS.PARAMS, prototype, method),
      }));
  }
}
