import { AppError } from "../errors/app-error";
import { PersonModel } from "../models/person.model";
import { SiteModel } from "../models/site.model";
import { extractSearchableText, sanitizePublishedHtml } from "../security/html-sanitizer";
import { normalizeAddress } from "../utils/address";

export const siteService = {
  async list() {
    return SiteModel.find().sort({ address: 1 }).select("address title authorId").lean();
  },

  async get(addressInput: string) {
    const address = normalizeAddress(addressInput);
    const site = await SiteModel.findOne({ address }).populate("authorId", "name").lean();
    if (!site) throw new AppError(404, `No website exists at ${address}.`, "SITE_NOT_FOUND");
    return site;
  },

  async publish(input: { publisherId: string; address: string; title: string; htmlContent: string }) {
    const address = normalizeAddress(input.address);
    const publisher = await PersonModel.findById(input.publisherId).lean();
    if (!publisher || !["publisher", "both"].includes(publisher.type)) {
      throw new AppError(400, "Choose a valid publisher from the list.", "INVALID_PUBLISHER");
    }
    if (await SiteModel.exists({ address })) {
      throw new AppError(409, "That address is already published.", "ADDRESS_EXISTS");
    }
    const htmlContent = sanitizePublishedHtml(input.htmlContent);
    const searchableText = extractSearchableText(htmlContent);
    if (!searchableText) throw new AppError(400, "HTML must contain readable text.", "EMPTY_CONTENT");
    const site = await SiteModel.create({
      address,
      title: input.title.trim(),
      htmlContent,
      searchableText,
      authorId: publisher._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return site.toObject();
  }
};
