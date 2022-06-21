const Card = require('../models/card');
// const CastError = 400;
// const ValidationError = 400;
// const NotFoundError = 404;
// const InternalServerError = 500;
module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .populate('owner')
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500)
      .send({ message: `Ошибка по умолчанию. ${err}` }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при создании карточки' });
      } else res.status(500).send({ message: `Ошибка по умолчанию. ${err}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Карточка с указанным _id не найдена' });
      } else {
        res.send({ message: 'Карточка удалена' });
      }
    })
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
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } else {
        res.status(500)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
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
    .then((card) => {
      if (!card) {
        res.status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } else {
        res.status(500)
          .send({ message: 'Ошибка по умолчанию' });
      }
    });
};