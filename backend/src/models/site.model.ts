import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const siteSchema = new Schema({
  address: { type: String, required: true, unique: true, lowercase: true, trim: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  htmlContent: { type: String, required: true },
  searchableText: { type: String, default: "" },
  authorId: { type: Schema.Types.ObjectId, ref: "Person", required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  updatedAt: { type: Date, required: true, default: Date.now }
}, { versionKey: false });

siteSchema.index({ searchableText: "text", title: "text" });
export type Site = InferSchemaType<typeof siteSchema>;
export const SiteModel: Model<Site> =
  (models.Site as Model<Site> | undefined) || model<Site>("Site", siteSchema);
