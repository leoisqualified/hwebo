import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Error occurred:", err);

  let status = 500;
  let message = "Internal Server Error";
  let details = null;

  // Handle known cases
  if (err.statusCode) {
    status = err.statusCode;
    message = err.message;
  } else if (err.name === "ValidationError") {
    status = 400;
    message = "Validation Error";
    details = err.errors || null;
  } else if (err.name === "EntityNotFound") {
    status = 404;
    message = "Resource not found";
  } else if (err.code === "23505") {
    // Example: PostgreSQL unique constraint violation
    status = 400;
    message = "Duplicate entry detected";
  }

  res.status(status).json({
    status,
    error: message,
    ...(details && { details }), // Include additional details if available
  });
}
