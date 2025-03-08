const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [50, 'Name must be 50 characters at most.'],
    },
    username: {
      type: String,
      required: [true, 'Please provide a username.'],
      unique: [true, 'Already used username.'],
      maxlength: [50, 'Username must be 50 characters at most.'],
      match: [/^(?!\.)(?!.*\.$)[a-zA-Z0-9_.]+$/, 'Username invalid format.'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address.'],
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
      select: false,
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
    passwordChangedAt: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.virtual('links', {
  ref: 'Link',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  if (this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTIssuedAT) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTIssuedAT < changedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
