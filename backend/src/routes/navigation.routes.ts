import { Router } from "express";
import {
  getNavigation, goBack, goForward, navigate, restorePage
} from "../controllers/navigation.controller";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middleware/validate.middleware";
import {
  navigationBody, navigationPersonBody, personParams, restoreBody
} from "../validators/api.validators";

export const navigationRoutes = Router()
  .get("/:personId", validate(personParams, "params"), asyncHandler(getNavigation))
  .post("/navigate", validate(navigationBody, "body"), asyncHandler(navigate))
  .post("/back", validate(navigationPersonBody, "body"), asyncHandler(goBack))
  .post("/forward", validate(navigationPersonBody, "body"), asyncHandler(goForward))
  .post("/restore", validate(restoreBody, "body"), asyncHandler(restorePage));
