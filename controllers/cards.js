const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  console.log(req.body);
  Card.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .populate('owner')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-ни одна карточка не найдена. ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500)
      .send({ message: `Произошла ошибка-данные карточки не записались. ${err}` }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500)
      .send({ message: `Произошла ошибка-эта карточка не найдена. ${err}` }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500)
      .send({ message: `Произошла ошибка-эта карточка не найдена. ${err}` }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    { _id: req.params.cardId },
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => res.status(500)
      .send({ message: `Произошла ошибка-эта карточка не найдена. ${err}` }));
};
