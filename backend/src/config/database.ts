import mongoose from "mongoose";
import { env } from "./environment";

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
}
