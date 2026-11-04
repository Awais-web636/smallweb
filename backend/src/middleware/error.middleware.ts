import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/app-error";
import { env } from "../config/environment";

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError) {
    response.status(error.statusCode).json({ error: { code: error.code, message: error.message } });
    return;
  }
  if (error instanceof mongoose.Error.ValidationError || error instanceof mongoose.Error.CastError) {
    response.status(400).json({ error: { code: "INVALID_DATA", message: "The submitted data is invalid." } });
    return;
  }
  if (error?.code === 11000) {
    response.status(409).json({ error: { code: "ADDRESS_EXISTS", message: "That address is already published." } });
    return;
  }
  if (error instanceof SyntaxError && "body" in error) {
    response.status(400).json({ error: { code: "INVALID_JSON", message: "Request body must be valid JSON." } });
    return;
  }
  console.error(error);
  response.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: env.NODE_ENV === "production" ? "An unexpected server error occurred." : "An unexpected server error occurred."
    }
  });
};
