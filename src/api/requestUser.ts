import { Request, Response, NextFunction } from "express";
import { UnAuthorizedError } from "../utils/errors/appError.utils"; // Importing centralized error

// Middleware to check if the user has the required role (admin or customer)
export const requireRole = (requiredRole: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      // If the user is not found, throw a centralized UnAuthorizedError
      throw new UnAuthorizedError("User not authenticated or found.");
    }

    // Corrected condition: checking 'admin' instead of 'isAdmin'
    if (user.admin !== requiredRole) {
      console.log("Im here because of role mismatch");
      // If the user does not have the required role, throw a centralized UnAuthorizedError
      throw new UnAuthorizedError("Access denied: insufficient permissions.");
    }

    // If the user has the required role, proceed to the next middleware
    next();
  };
};
