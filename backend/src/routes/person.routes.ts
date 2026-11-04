import { Router } from "express";
import { listPeople } from "../controllers/person.controller";
import { asyncHandler } from "../utils/async-handler";

export const personRoutes = Router().get("/", asyncHandler(listPeople));
