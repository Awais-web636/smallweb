export type Person = { _id: string; name: string; type: "reader" | "publisher" | "both" };
export type Site = {
  _id?: string;
  address: string;
  title: string;
  htmlContent: string;
  searchableText?: string;
  authorId?: { _id: string; name: string } | string;
};
export type NavigationEntry = { address: string; scrollY: number; visitId: string | null };
export type NavigationState = {
  entries: NavigationEntry[];
  currentIndex: number;
  canGoBack: boolean;
  canGoForward: boolean;
};
export type Visit = {
  _id: string;
  address: string;
  visitedAt: string;
  navigationType: string;
  siteId?: { title?: string } | string;
};
export type SearchResult = { address: string; title: string; snippet: string };
