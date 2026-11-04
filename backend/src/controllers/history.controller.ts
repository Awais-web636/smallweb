import type { Request, Response } from "express";
import { historyService } from "../services/history.service";

export async function getHistory(request: Request, response: Response): Promise<void> {
  response.json({ visits: await historyService.list(String(request.query.personId)) });
}
