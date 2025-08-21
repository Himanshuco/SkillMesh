const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  userType: {
    type: String,
    enum: ['student', 'working_professional', 'freelancer', 'other'],
    default: 'other',
  },
  credits: {
    type: Number,
    default: 0,
  },
  badges: {
    type: [String],
    default: [],
  },
  skillsOfferedCount: {
    type: Number,
    default: 0,
  },
  skillsWanted: {
    type: [String],
    default: [],
  },
  skillsOffered: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  avatarUrl: {
    type: String,
    default: 'https://tse4.mm.bing.net/th/id/OIP.-awoELDwmTGlt2yQ4WtPgQAAAA?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
  },
  lastCreditUpdate: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'banned', 'suspended'],
    default: 'active',
  },
}, { timestamps: true });

userSchema.methods.updateCredits = async function({ teacherCredits = 0, learnerCredits = 0 }) {
  if (teacherCredits) {
    this.credits += teacherCredits;
  }
  if (learnerCredits) {
    this.credits -= learnerCredits;
  }
  
  this.lastCreditUpdate = new Date();
  await this.save();
};

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
