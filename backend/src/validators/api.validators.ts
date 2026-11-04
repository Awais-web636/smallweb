import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "A valid person ID is required.");
export const personParams = z.object({ personId: objectId });
export const addressParams = z.object({ address: z.string().min(1).max(255) });
export const historyQuery = z.object({ personId: objectId });
export const searchQuery = z.object({ q: z.string().trim().max(120) });
export const navigationBody = z.object({
  personId: objectId,
  address: z.string().min(1).max(255),
  navigationType: z.enum(["typed", "link", "search", "history"]).default("typed")
});
export const navigationPersonBody = z.object({ personId: objectId });
export const restoreBody = z.object({
  personId: objectId,
  entryId: objectId,
  scrollY: z.number().finite().min(0).max(10_000_000)
});
export const publishBody = z.object({
  publisherId: objectId,
  address: z.string().min(1).max(255),
  title: z.string().trim().min(1).max(120),
  htmlContent: z.string().trim().min(1).max(50_000)
});
