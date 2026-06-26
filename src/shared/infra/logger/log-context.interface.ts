export interface LogContext {
  requestId?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  errorType?: string;
  module?: string;
  action?: string;
  durationMs?: number;
  userId?: string;
  details?: unknown;
  stack?: string;
}
