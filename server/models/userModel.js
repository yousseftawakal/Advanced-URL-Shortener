const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name.'],
    maxlength: [50, 'Name must be 50 characters at most.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email address.'],
    unique: [true, 'Already used email address.'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email address.'],
  },
  photo: {
    type: String,
    default: 'default.png',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: [8, 'Password must be 8 characters at least.'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (e) {
        return e === this.password;
      },
      message: 'Passwords do not match.',
    },
  },
  links: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Link',
    },
  ],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
