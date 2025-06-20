// middlewares/authenticate.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/index";

interface JwtPayload {
  userId: string;
  role: "supplier" | "school" | "admin";
  verified: boolean;
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    (req as any).user = {
      userId: decoded.userId,
      role: decoded.role,
      verified: decoded.verified,
    };

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
