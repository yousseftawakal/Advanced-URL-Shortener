const express = require('express');
const linkRouter = require('./routes/linkRoutes');

const app = express();

app.use(express.json());

app.use('/api/', linkRouter);

module.exports = app;
