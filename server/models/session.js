const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  // Reference to the Skill involved in this session
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },

  // User acting as the teacher in the session
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // User acting as the learner in the session
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Scheduled date and time of the session
  scheduledAt: {
    type: Date,
    required: true
  },

  // Current status of the session
  status: {
    type: String,
    enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
    default: 'scheduled'
  },

  // Amount of credits transferred for this session
  creditsTransferred: {
    type: Number,
    required: true,
    min: 0
  },

  // Optional feedback from either party after completion
  feedback: {
    type: String,
    default: ''
  },

  // Optional rating (1 to 5 stars)
  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  // Timestamp of creation (redundant due to timestamps option, can be removed)
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Timestamp when the session was completed
  completedAt: {
    type: Date
  }
}, { timestamps: true }); // Automatically manages createdAt and updatedAt

module.exports = mongoose.model('Session', sessionSchema);
