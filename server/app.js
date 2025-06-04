const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const linkRouter = require('./routes/linkRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(cors());

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// const limiter = rateLimit({
//   max: 200,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP. Please try again in an hour.',
// });
// app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

app.use(compression());

app.use('/api/links', linkRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Page could not be found.', 404));
});

app.use(globalErrorHandler);

module.exports = app;
