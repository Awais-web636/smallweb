import { Router } from "express";
import { getHistory } from "../controllers/history.controller";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middleware/validate.middleware";
import { historyQuery } from "../validators/api.validators";

export const historyRoutes = Router()
  .get("/", validate(historyQuery, "query"), asyncHandler(getHistory));
