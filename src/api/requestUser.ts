import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../utils/errors/appError.utils"; // Importing centralized error

export const requireRole = (requiredRole: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      throw new UnAuthorizedError("User not authenticated or found.");
    }

    if (user.admin !== requiredRole) {
      throw new UnAuthorizedError("Access denied: insufficient permissions.");
    }

    next();
  };
};
