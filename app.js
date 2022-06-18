const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  family: 4,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', routerUser);
app.use('/cards', routerCard);

app.use((req, res, next) => {
  req.user = {
    _id: '62ac9e7b36a9252a1ad9bfa7',
  };

  next();
});

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не существует' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('App started', PORT);
});
