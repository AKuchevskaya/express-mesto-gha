const User = require('../models/user');
// const CastError = 400;
// const ValidationError = 400;
// const NotFoundError = 404;
// const InternalServerError = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-не найдены все пользователи. ${err}` }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else res.status(500).send({ message: `Произошла ошибка-этот пользователь не найден. ${err}` });
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
      upsert: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else res.status(500).send({ message: `Произошла ошибка-некорректные данные. ${err}` });
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
      upsert: true,
    },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара профиля' });
      } else res.status(500).send({ message: `Произошла ошибка-некорректные данные. ${err}` });
    });
};
