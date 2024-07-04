import mongoose from "mongoose";

const historySchema = mongoose.Schema({
  videoId: { type: String, require: true },
  Viewer: { type: String, require: true },
  AddedOn: { type: Date, default: Date.now },
});

export default mongoose.model("history", historySchema);
