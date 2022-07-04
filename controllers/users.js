const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  SUCCESSFUL_STATUS_CODE,
  CAST_OR_VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../constants/errors');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      // res.send({ token });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
      res.status(SUCCESSFUL_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: `Переданы некорректные данные при создании пользователя. ${err.message}` });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params._id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id пользователя' });
      } if (err.name === 'CastError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id пользователя' });
      } if (err.name === 'CastError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id пользователя' });
      } if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id пользователя' });
      } if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара профиля' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};
