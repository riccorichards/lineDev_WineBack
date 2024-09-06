import createServer from "./utils/server";
import config from "../config";
import db from "./utils/dbConnection";
import dotenv from "dotenv";
import api from "./api/api";
import { ZodError } from "zod";
import { BaseError } from "./utils/errors/appError.utils";
import { NextFunction, Request, Response } from "express";
dotenv.config();

const app = createServer();

db();

api(app);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: err.errors,
    });
  }

  // Handle custom errors (like NotFoundError, BadRequestError)
  if (err instanceof BaseError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Handle any other unknown errors
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

app.listen(config.port, () => {
  console.info(`We are Running at http//localhost:${config.port}`);
});
