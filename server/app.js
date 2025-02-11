const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('<h1>Hello from the server!</h1>');
});

module.exports = app;
