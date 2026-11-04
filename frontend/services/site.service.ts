import { apiRequest, postJson } from "@/lib/api";
import type { Person, Site } from "@/types";

export const siteService = {
  async list(): Promise<Site[]> {
    return (await apiRequest<{ sites: Site[] }>("/sites")).sites;
  },
  async get(address: string): Promise<Site> {
    return (await apiRequest<{ site: Site }>(`/sites/${encodeURIComponent(address)}`)).site;
  },
  async publish(input: { publisherId: string; address: string; title: string; htmlContent: string }): Promise<Site> {
    return (await apiRequest<{ site: Site }>("/sites", postJson(input))).site;
  },
  async people(): Promise<Person[]> {
    return (await apiRequest<{ people: Person[] }>("/people")).people;
  }
};
