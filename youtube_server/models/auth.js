import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: { type: String, require: true },
  name: { type: String },
  desc: { type: String },
  points: { type: Number, default: 0 },
  joinedOn: { type: Date, default: Date.now },
});

export default mongoose.model("user", userSchema);
