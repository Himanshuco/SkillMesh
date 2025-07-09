const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  // Type of skill record: either an offer or a request
  type: {
    type: String,
    enum: ['offer', 'request'],
    required: true
  },

  // Title of the skill offering/request
  title: {
    type: String,
    required: true,
    trim: true
  },

  // Optional detailed description
  description: {
    type: String,
    default: ''
  },

  // Tags for easier searching/filtering
  tags: {
    type: [String],
    default: []
  },

  // Location where the skill applies; defaults to 'online'
  location: {
    type: String,
    default: 'online'
  },

  // Status of the skill request/offer
  status: {
    type: String,
    enum: ['open', 'matched', 'completed'],
    default: 'open'
  },

  // Reference to user who posted the skill
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Reference to user who accepted this skill offer/request
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },

  // Timestamp of creation (handled by timestamps option as well, but explicit here)
  createdAt: {
    type: Date,
    default: Date.now
  },

  // Timestamp when skill task was completed
  completedAt: {
    type: Date,
    default: null
  },

  // List of resource links or references related to this skill
  resources: {
    type: [String],
    default: []
  },

  // Category for classification (e.g., 'Programming', 'Design', etc.)
  category: {
    type: String,
    default: ''
  }
}, { timestamps: true }); // automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('Skill', skillSchema);
