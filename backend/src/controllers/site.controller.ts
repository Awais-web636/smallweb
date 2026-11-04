import type { Request, Response } from "express";
import { siteService } from "../services/site.service";

export async function listSites(_request: Request, response: Response): Promise<void> {
  response.json({ sites: await siteService.list() });
}

export async function getSite(request: Request, response: Response): Promise<void> {
  response.json({ site: await siteService.get(request.params.address) });
}

export async function publishSite(request: Request, response: Response): Promise<void> {
  const site = await siteService.publish(request.body);
  response.status(201).json({ site });
}
