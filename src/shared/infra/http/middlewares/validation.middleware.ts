import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await validate(instance);

    if (errors.length > 0) {
      const validationErrors = errors.map((error: ValidationError) => ({
        property: error.property,
        constraints: error.constraints,
      }));

      return res.status(400).json({ errors: validationErrors });
    }

    req.body = instance;
    next();
  };
}
