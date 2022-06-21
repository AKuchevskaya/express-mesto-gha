const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
const { NOT_FOUND_ERROR_CODE } = require('./constants/errors');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62b03fb012fc43433cbd9bcc',
  };

  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCard);
app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не существует' });
});

app.listen(PORT, () => {
  console.log('App started', PORT);
});
