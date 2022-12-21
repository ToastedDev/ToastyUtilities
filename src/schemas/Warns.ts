import { model, Schema } from "mongoose";

export default model(
  "warns",
  new Schema({
    guild: { type: String, required: true },
    user: { type: String, required: true },
    moderator: { type: String, required: true },
    reason: { type: String, default: "No reason specified." },
  })
);
