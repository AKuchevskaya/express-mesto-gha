const Card = require('../models/card');

module.exports.createCard = (req, res) => {
  console.log(req.user._id);
  const { name, link } = req.body;

  Card.create({ name, link })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-данные карточки не записались. ${err}` }));
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-ни одна карточка не найдена. ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-эта карточка не найдена. ${err}` }));
};
