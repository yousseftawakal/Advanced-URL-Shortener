const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const linkRouter = require('./routes/linkRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(cookieParser());

app.use('/api/links', linkRouter);
app.use('/api/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Page could not be found.', 404));
});

module.exports = app;
