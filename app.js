const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
const {
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('./constants/errors');

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https?:\/\/(www.)?([\w\-\\.]+)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=,]*/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.use(cookieParser());

app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Страница не существует' });
});

app.use((err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  } if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  } if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  console.error(err.stack);
  return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
});

app.listen(PORT, () => {
  console.log('App started', PORT);
});
