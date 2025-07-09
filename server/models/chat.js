const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('chat', chatSchema);
