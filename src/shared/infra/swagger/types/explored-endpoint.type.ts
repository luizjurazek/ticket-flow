import { ApiOperationMetadata } from './api-operation.type';
import { ApiRouteMetadata } from './api-route.type';
import { ApiResponseMetadata } from './api-response.type';
import { ApiBodyMetadata } from './api-body.type';
import { ApiParamMetadata } from './api-params.type';

export interface ExploredEndpoint {
  methodName: string;
  route?: ApiRouteMetadata;
  operation?: ApiOperationMetadata;
  responses?: ApiResponseMetadata[];
  body?: ApiBodyMetadata;
  params?: ApiParamMetadata[];
  tags?: string[];
}
