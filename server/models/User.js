const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  // Basic user info
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true // indexing for faster queries by email
  },

  // User role/type
  userType: {
    type: String,
    enum: ['student', 'working_professional', 'freelancer', 'other'],
    default: 'other'
  },

  // User credits for platform usage
  credits: {
    type: Number,
    default: 0
  },

  // Achievements or badges earned by the user
  badges: {
    type: [String],
    default: []
  },

  // Count of skills the user offers (optional, can be derived from skillsOffered.length)
  skillsOfferedCount: {
    type: Number,
    default: 0
  },

  // Arrays of skills user wants and offers
  skillsWanted: {
    type: [String],
    default: []
  },
  skillsOffered: {
    type: [String],
    default: []
  },

  // Location and bio info for profile
  location: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },

  // Avatar image URL, with a default placeholder image
  avatarUrl: {
    type: String,
    default: 'https://tse4.mm.bing.net/th/id/OIP.-awoELDwmTGlt2yQ4WtPgQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3'
  },
  

  /*
  // Optional fields for advanced features:
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  lastCreditUpdate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'suspended'],
    default: 'active'
  }
  */
}, { timestamps: true });

// Configure passport-local-mongoose plugin to authenticate using email field
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
