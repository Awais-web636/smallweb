import type { Request, Response } from "express";
import { personService } from "../services/person.service";

export async function listPeople(_request: Request, response: Response): Promise<void> {
  response.json({ people: await personService.list() });
}
