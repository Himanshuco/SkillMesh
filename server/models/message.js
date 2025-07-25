// models/message.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: String, required: true },
  text: { type: String, required: true }, 
}, {
  timestamps: true
});

module.exports = mongoose.model("Message", messageSchema);
