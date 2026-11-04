import type { Request, Response } from "express";
import { navigationService } from "../services/navigation.service";

export async function getNavigation(request: Request, response: Response): Promise<void> {
  response.json({ navigation: await navigationService.get(request.params.personId) });
}

export async function navigate(request: Request, response: Response): Promise<void> {
  const { personId, address, navigationType = "typed" } = request.body;
  response.json(await navigationService.navigate(personId, address, navigationType));
}

export async function goBack(request: Request, response: Response): Promise<void> {
  response.json(await navigationService.move(request.body.personId, "back"));
}

export async function goForward(request: Request, response: Response): Promise<void> {
  response.json(await navigationService.move(request.body.personId, "forward"));
}

export async function restorePage(request: Request, response: Response): Promise<void> {
  response.json({
    navigation: await navigationService.restore(request.body.personId, request.body.entryId, request.body.scrollY)
  });
}
