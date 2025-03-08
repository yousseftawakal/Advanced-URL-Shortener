const mongoose = require('mongoose');
const validator = require('validator');

const linkSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Please provide a URL.'],
    validate: [validator.isURL, 'Please provide a valid URL.'],
  },
  shortCode: {
    type: String,
    required: true,
    lowercase: true,
    unique: [true, 'Already used short code.'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  accessCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Link must belong to a user.'],
  },
});

linkSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;
