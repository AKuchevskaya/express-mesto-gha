const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  SUCCESSFUL_STATUS_CODE,
  CAST_OR_VALIDATION_ERROR_CODE,
  UNAUTHORIZED_ERROR_CODE,
  CONFLICT_EMAIL_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
// const ForbiddenError = require('../errors/ForbiddenError'); // 403
const NotFoundError = require('../errors/NotFoundError'); // 404

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        'very-secret-key',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      // res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).status(SUCCESSFUL_STATUS_CODE).end();
    })
    .catch((err) => {
      // ошибка аутентификации

      if (err.statusCode === 401) {
        res.status(UNAUTHORIZED_ERROR_CODE).send({ message: err.message });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    const error = new Error('Не передан email или пароль.');
    error.statusCode = CAST_OR_VALIDATION_ERROR_CODE;
    throw error;
  }
  return bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))

    .then((user) => {
      res.status(SUCCESSFUL_STATUS_CODE)
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err.name === 'MongoServerError') {
        const error = new Error('Такой email уже существует.');
        error.statusCode = CONFLICT_EMAIL_ERROR_CODE;
        throw error;
      }
      throw err;
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' }));
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadReqError('Передан некорректный _id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
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
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      next(new NotFoundError('Передан несуществующий _id пользователя'));
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadReqError('Переданы некорректные данные при обновлении аватара профиля'));
      } else {
        next(err);
      }
    });
};
