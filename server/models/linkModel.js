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
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: Date,
  accessCount: Number,
});

const Link = mongoose.model('User', linkSchema);

module.exports = Link;
