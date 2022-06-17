const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./routes/users'));

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы не существует' });
});
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App started', PORT);
});
