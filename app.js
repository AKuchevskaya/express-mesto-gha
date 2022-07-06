const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { Joi, celebrate, errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
// const validatorErrors = require('./middlewares/validatorErrors');
const routerUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
const {
  SERVER_ERROR_CODE,
} = require('./constants/errors');
const NotFoundError = require('./errors/NotFoundError'); // 404

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
    avatar: Joi.string().pattern(/http(s?):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:?#[\]@!$&'()*+,;=]+)/),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(4),
  }),
}), createUser);

app.use(cookieParser());

app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCard);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не существует'));
});

app.use(errors({ message: 'Проверьте корректность введенных данных' }));

// app.use(validatorErrors);

app.use((err, req, res, next) => {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }
  console.error(err.stack);
  res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
  next();
});

app.listen(PORT, () => {
  console.log('App started', PORT);
});
