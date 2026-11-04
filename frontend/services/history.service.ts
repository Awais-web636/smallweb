import { apiRequest } from "@/lib/api";
import type { Visit } from "@/types";

export const historyService = {
  async list(personId: string): Promise<Visit[]> {
    return (await apiRequest<{ visits: Visit[] }>(`/history?personId=${encodeURIComponent(personId)}`)).visits;
  }
};
