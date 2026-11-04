import { Router } from "express";
import { searchSites } from "../controllers/search.controller";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middleware/validate.middleware";
import { searchQuery } from "../validators/api.validators";

export const searchRoutes = Router()
  .get("/", validate(searchQuery, "query"), asyncHandler(searchSites));
