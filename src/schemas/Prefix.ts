import { model, Schema } from "mongoose";
import { prefix } from "../config";

export default model(
  "prefixes",
  new Schema({
    guild: { type: String, required: true },
    prefix: { type: String, default: prefix },
  })
);
