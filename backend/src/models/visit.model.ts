import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const visitSchema = new Schema({
  personId: { type: Schema.Types.ObjectId, ref: "Person", required: true },
  siteId: { type: Schema.Types.ObjectId, ref: "Site", required: true },
  address: { type: String, required: true, lowercase: true, trim: true },
  visitedAt: { type: Date, required: true },
  navigationType: {
    type: String,
    enum: ["typed", "link", "back", "forward", "history", "search"],
    required: true
  },
  sequence: { type: Number, required: true, min: 1 }
}, { versionKey: false });

visitSchema.index({ personId: 1, visitedAt: -1 });
visitSchema.index({ personId: 1, sequence: 1 }, { unique: true });

export type Visit = InferSchemaType<typeof visitSchema>;
export const VisitModel: Model<Visit> =
  (models.Visit as Model<Visit> | undefined) || model<Visit>("Visit", visitSchema);
