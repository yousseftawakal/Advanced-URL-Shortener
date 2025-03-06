const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const linkRouter = require('./routes/linkRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.use(mongoSanitize());
app.use(xss());

app.use('/api/links', linkRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Page could not be found.', 404));
});

app.use(globalErrorHandler);

module.exports = app;
