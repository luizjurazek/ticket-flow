import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppError } from '@/shared/errors/app-error';

type ValidationSource = 'body' | 'params' | 'query';

type ValidationSchema = Partial<Record<ValidationSource, new () => object>>;

interface ParsedValidationError {
  source: ValidationSource;
  property: string;
  constraints?: Record<string, string>;
}

async function validateSource(
  req: Request,
  source: ValidationSource,
  dtoClass: new () => object,
): Promise<ParsedValidationError[]> {
  const instance = plainToInstance(dtoClass, req[source]);
  const errors = await validate(instance);

  if (errors.length === 0) {
    Object.assign(req[source], instance);
    return [];
  }

  return errors.map((error: ValidationError) => ({
    source,
    property: error.property,
    constraints: error.constraints,
  }));
}

export function validateDto(dtoClass: new () => object, source: ValidationSource = 'body') {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const validationErrors = await validateSource(req, source, dtoClass);

    if (validationErrors.length > 0) {
      return next(
        new AppError(`${validationErrors.length} validation error(s) found`, 400, validationErrors),
      );
    }

    next();
  };
}

export function validateRequest(schema: ValidationSchema) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const entries = Object.entries(schema) as [ValidationSource, new () => object][];
    const results = await Promise.all(
      entries.map(([source, dtoClass]) => validateSource(req, source, dtoClass)),
    );
    const validationErrors = results.flat();

    if (validationErrors.length > 0) {
      return next(
        new AppError(`${validationErrors.length} validation error(s) found`, 400, validationErrors),
      );
    }

    next();
  };
}
