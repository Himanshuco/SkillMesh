const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const skillRequestSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  category: String,
  status: { type: String, enum: ["pending", "matched", "in progress", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SkillRequest", skillRequestSchema);
