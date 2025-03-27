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
    minlength: [1, 'Short code must be at least 1 character long'],
    maxlength: [16, 'Short code cannot exceed 16 characters'],
    validate: [
      {
        validator: function (v) {
          return /^[a-zA-Z0-9]+$/.test(v);
        },
        message: 'Short code can only contain letters and numbers',
      },
    ],
    trim: true,
  },
  qrCode: {
    type: String,
    required: true,
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
