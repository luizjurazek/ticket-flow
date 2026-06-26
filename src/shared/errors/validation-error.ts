export type ValidationSource = 'body' | 'params' | 'query';

export interface ValidationFieldError {
  source: ValidationSource;
  property: string;
  constraints?: Record<string, string>;
}

export interface ApiFieldError {
  field: string;
  source: ValidationSource;
  messages: string[];
}

export function isValidationFieldError(details: unknown): details is ValidationFieldError[] {
  if (!Array.isArray(details) || details.length === 0) {
    return false;
  }

  const first = details[0];

  return (
    typeof first === 'object' &&
    first !== null &&
    'property' in first &&
    'source' in first
  );
}

export function toApiFieldErrors(details: ValidationFieldError[]): ApiFieldError[] {
  return details.map(({ source, property, constraints }) => ({
    field: property,
    source,
    messages: Object.values(constraints ?? {}),
  }));
}

export function formatValidationErrorsForLog(details: ValidationFieldError[]): string {
  return details
    .map(({ source, property, constraints }) => {
      const messages = Object.values(constraints ?? {}).join(', ') || 'Unknown error';
      return `  - ${source}.${property}: ${messages}`;
    })
    .join('\n');
}
