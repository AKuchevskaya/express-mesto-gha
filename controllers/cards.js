const Card = require('../models/card');
const {
  SUCCESSFUL_STATUS_CODE,
  CAST_OR_VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  SERVER_ERROR_CODE,
} = require('../constants/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => res.status(SUCCESSFUL_STATUS_CODE).send({ data: cards }))
    .catch(() => {
      res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(SUCCESSFUL_STATUS_CODE).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: `Переданы некорректные данные при создании карточки. ${err.message}` });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove({ _id: req.params.cardId })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.status(SUCCESSFUL_STATUS_CODE).send({ data: card, message: 'Карточка удалена' }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Карточка с указанным _id не найдена' });
      } if (err.name === 'CastError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для удаления карточки' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
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
    .then((card) => res.status(SUCCESSFUL_STATUS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      } if (err.name === 'CastError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
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
    .then((card) => res.status(SUCCESSFUL_STATUS_CODE).send({ data: card }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
      } if (err.name === 'CastError') {
        return res.status(CAST_OR_VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
      } return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
    });
};
