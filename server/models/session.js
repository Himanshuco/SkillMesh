const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  skill: { type: String, required: true },  // Skill ID or skill name (string)
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  status: { type: String, enum: ['scheduled', 'completed'], default: 'scheduled' },
  creditsTransferred: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
//Done