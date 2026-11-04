import { SiteModel } from "../models/site.model";
import { AppError } from "../errors/app-error";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const searchService = {
  async search(query: string) {
    const term = query.trim();
    if (!term) throw new AppError(400, "Enter a search term.", "EMPTY_QUERY");
    const regex = new RegExp(escapeRegex(term), "i");
    const sites = await SiteModel.find({
      $or: [{ searchableText: regex }, { title: regex }]
    })
      .select("address title searchableText")
      .limit(50)
      .lean();
    return sites.map((site) => {
      const match = regex.exec(site.searchableText) || regex.exec(site.title);
      const text = site.searchableText;
      const start = match && match.index >= 0 ? Math.max(0, match.index - 70) : 0;
      const end = Math.min(text.length, start + 180);
      return {
        address: site.address,
        title: site.title,
        snippet: `${start > 0 ? "…" : ""}${text.slice(start, end)}${end < text.length ? "…" : ""}`
      };
    });
  }
};
