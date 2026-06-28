export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export interface ApiRouteMetadata {
  method: HttpMethod;
  path: string;
}
