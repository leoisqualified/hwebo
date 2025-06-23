import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schema: ZodSchema<any>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // Make return type explicit
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({ errors: parseResult.error.format() }); // Don't return
      return; // Exit the function, but don't return a Response object
    }

    next();
  };
