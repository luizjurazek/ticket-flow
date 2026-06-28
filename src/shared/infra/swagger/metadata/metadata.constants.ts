export const METADATA_KEYS = {
  ROUTE: Symbol('swagger:route'),
  OPERATION: Symbol('swagger:operation'),
  RESPONSE: Symbol('swagger:response'),
  PROPERTY: Symbol('swagger:property'),
  BODY: Symbol('swagger:body'),
  PARAMS: Symbol('swagger:params'),
} as const;
