import { apiRequest } from "@/lib/api";
import type { SearchResult } from "@/types";

export const searchService = {
  async search(query: string): Promise<SearchResult[]> {
    return (await apiRequest<{ results: SearchResult[] }>(`/search?q=${encodeURIComponent(query)}`)).results;
  }
};
