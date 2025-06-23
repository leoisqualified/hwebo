// middlewares/authorize.ts
import { Request, Response, NextFunction } from "express";

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "Access denied" });
      return;
    }

    next();
  };
};
