const express = require('express');
const app = express();
const linkRouter = require('./routes/linkRoutes');

app.use('/api/', linkRouter);

module.exports = app;
