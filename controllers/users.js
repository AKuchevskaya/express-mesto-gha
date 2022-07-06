const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  SUCCESSFUL_STATUS_CODE,
  UNAUTHORIZED_ERROR_CODE,
  MONGO_DUPLICATE_ERROR_CODE,
} = require('../constants/errors');

const BadReqError = require('../errors/BadReqError'); // 400
const UnauthorizedError = require('../errors/UnauthorizedError'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const MongoServerError = require('../errors/MongoServerError'); // 409

module.exports.login = (req, res, next) => {
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
      // console.log({ token });
      // res.send({ token });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      }).status(SUCCESSFUL_STATUS_CODE).end();
    })
    .catch((err) => {
      // ошибка аутентификации

      if (err.statusCode === UNAUTHORIZED_ERROR_CODE) {
        next(new UnauthorizedError('Требуется авторизация.'));
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    next(new BadReqError('Не передан email или пароль.'));
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
      if (err.statusCode === MONGO_DUPLICATE_ERROR_CODE) {
        next(new MongoServerError('Такой email уже существует.'));
      }
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({}, '-password -__v')
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
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
