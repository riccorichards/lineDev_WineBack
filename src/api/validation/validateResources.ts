import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

// Middleware function for validating incoming data using Zod
export const validateIncomingData =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the request object, including body, params, and query
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation Error:", error.errors);
        // Return detailed validation error messages
        return res.status(400).json({
          status: "error",
          errors: error.errors.map((err) => ({
            path: err.path,
            message: err.message,
          })),
        });
      }

      // Handle unexpected errors
      console.error("Server Internal Error:", error);
      return res.status(500).json({ error: "Server Internal Error" });
    }
  };
