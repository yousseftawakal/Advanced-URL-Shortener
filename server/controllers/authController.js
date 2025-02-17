const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const createSendToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure,
  });

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, username, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    username,
    email,
    password,
    passwordConfirm,
  });

  createSendToken(user, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password)
    return next(
      new AppError('Please provide username or email, and password.', 400)
    );

  const user = await User.findOne({ $or: [{ username }, { email }] }).select(
    '+password'
  );

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect username, email or password', 401));

  createSendToken(user, 200, req, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', '', {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};
