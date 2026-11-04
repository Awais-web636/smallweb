import { Schema, model, models, type InferSchemaType } from "mongoose";

const personSchema = new Schema({
  _id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ["reader", "publisher", "both"], required: true },
  createdAt: { type: Date, required: true, default: Date.now }
}, { versionKey: false });

personSchema.index({ name: 1 }, { unique: true });

export type Person = InferSchemaType<typeof personSchema>;
export const PersonModel = models.Person || model("Person", personSchema);
