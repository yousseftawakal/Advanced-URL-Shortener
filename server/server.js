require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<DB_PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log('DB connected successfully!'));

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
