import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/app-error";

export function validate<T>(schema: ZodType<T>, source: "body" | "query" | "params"): RequestHandler {
  return (request, _response, next) => {
    const result = schema.safeParse(request[source]);
    if (!result.success) {
      next(new AppError(400, result.error.issues[0]?.message || "Request validation failed.", "VALIDATION_ERROR"));
      return;
    }
    next();
  };
}
