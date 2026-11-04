import { Schema, model, models, type InferSchemaType } from "mongoose";

const entrySchema = new Schema({
  address: { type: String, required: true, lowercase: true, trim: true },
  scrollY: { type: Number, min: 0, default: 0 },
  visitId: { type: Schema.Types.ObjectId, ref: "Visit", default: null }
}, { _id: false });

const browserSessionSchema = new Schema({
  personId: { type: Schema.Types.ObjectId, ref: "Person", required: true, unique: true },
  entries: { type: [entrySchema], default: [] },
  currentIndex: { type: Number, required: true, default: -1 },
  revision: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, required: true, default: Date.now }
}, { versionKey: false });

browserSessionSchema.index({ personId: 1 }, { unique: true });

export type BrowserSession = InferSchemaType<typeof browserSessionSchema>;
export const BrowserSessionModel = models.BrowserSession || model("BrowserSession", browserSessionSchema);
