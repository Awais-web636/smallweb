import type { Request, Response } from "express";
import { searchService } from "../services/search.service";

export async function searchSites(request: Request, response: Response): Promise<void> {
  response.json({ results: await searchService.search(String(request.query.q || "")) });
}
