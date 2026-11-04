import { apiRequest, postJson } from "@/lib/api";
import type { NavigationState, Site } from "@/types";

type NavigationResponse = { navigation: NavigationState };

export const navigationService = {
  async get(personId: string): Promise<NavigationState> {
    return (await apiRequest<NavigationResponse>(`/navigation/${personId}`)).navigation;
  },
  async navigate(personId: string, address: string, navigationType: string): Promise<{ site: Site; navigation: NavigationState }> {
    return apiRequest("/navigation/navigate", postJson({ personId, address, navigationType }));
  },
  async back(personId: string): Promise<{ site: Site; scrollY: number; navigation: NavigationState }> {
    return apiRequest("/navigation/back", postJson({ personId }));
  },
  async forward(personId: string): Promise<{ site: Site; scrollY: number; navigation: NavigationState }> {
    return apiRequest("/navigation/forward", postJson({ personId }));
  },
  async saveScroll(personId: string, entryId: string, scrollY: number): Promise<NavigationState> {
    return (await apiRequest<NavigationResponse>("/navigation/restore", postJson({ personId, entryId, scrollY }))).navigation;
  }
};
