const Joi = require('joi');
const mongoose = require('mongoose');

// Helper to validate ObjectId strings
const objectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'ObjectId Validation');

// -------- Session Joi schema --------
const sessionSchema = Joi.object({
  skill: objectId.required(),
  teacher: objectId.required(),
  learner: objectId.required(),
  scheduledAt: Joi.date().required(),
  status: Joi.string().valid('scheduled', 'completed', 'cancelled', 'no_show').default('scheduled'),
  creditsTransferred: Joi.number().min(0).required(),
  feedback: Joi.string().allow('', null),
  rating: Joi.number().min(1).max(5).optional(),
  completedAt: Joi.date().optional(),
});

// -------- Skill Joi schema --------
const skillSchema = Joi.object({
  type: Joi.string().valid('offer', 'request').required(),
  title: Joi.string().trim().required(),
  description: Joi.string().allow('', null),
  tags: Joi.array().items(Joi.string()).default([]),
  location: Joi.string().default('online'),
  status: Joi.string().valid('open', 'matched', 'completed').default('open'),
  postedBy: objectId.required(),
  acceptedBy: objectId.allow(null),
  completedAt: Joi.date().allow(null),
  resources: Joi.array().items(Joi.string()).default([]),
  category: Joi.string().allow('', null),
});

// -------- User Joi schema --------
const userSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required(),
  userType: Joi.string().valid('student', 'working_professional', 'freelancer', 'other').default('other'),
  credits: Joi.number().min(0).default(0),
  badges: Joi.array().items(Joi.string()).default([]),
  skillsOfferedCount: Joi.number().min(0).default(0),
  skillsWanted: Joi.array().items(Joi.string()).default([]),
  skillsOffered: Joi.array().items(Joi.string()).default([]),
  location: Joi.string().trim().allow('', null),
  bio: Joi.string().trim().allow('', null),
  avatarUrl: Joi.string().uri().allow('', null),
});

module.exports = {
  sessionSchema,
  skillSchema,
  userSchema,
};
