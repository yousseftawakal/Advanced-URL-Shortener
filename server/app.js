const express = require('express');
const morgan = require('morgan');

const linkRouter = require('./routes/linkRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

app.use('/api/links', linkRouter);

app.all('*', (req, res, next) => {
  next(new AppError('Page could not be found.', 404));
});

module.exports = app;
