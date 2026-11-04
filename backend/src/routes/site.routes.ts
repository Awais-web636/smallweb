import { Router } from "express";
import { getSite, listSites, publishSite } from "../controllers/site.controller";
import { asyncHandler } from "../utils/async-handler";
import { validate } from "../middleware/validate.middleware";
import { addressParams, publishBody } from "../validators/api.validators";

export const siteRoutes = Router()
  .get("/", asyncHandler(listSites))
  .get("/:address", validate(addressParams, "params"), asyncHandler(getSite))
  .post("/", validate(publishBody, "body"), asyncHandler(publishSite));
