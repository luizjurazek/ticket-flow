export type ApiParamIn = 'path' | 'query' | 'header' | 'cookie';
export type ApiParamType = 'string' | 'number' | 'boolean' | 'integer';
export interface ApiParamMetadata {
  name: string;
  in: ApiParamIn;
  description?: string;
  required?: boolean;
  type?: ApiParamType;
}
