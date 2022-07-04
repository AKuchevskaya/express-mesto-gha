const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
const { NOT_FOUND_ERROR_CODE } = require('./constants/errors');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use(cookieParser());

app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не существует' });
});

app.listen(PORT, () => {
  console.log('App started', PORT);
});
