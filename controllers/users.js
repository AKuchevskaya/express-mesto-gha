const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-данные не записались. ${err}` }));
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-не найдены все пользователи. ${err}` }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-этот пользователь не найден. ${err}` }));
};
