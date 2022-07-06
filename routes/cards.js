const routerCard = require('express').Router();
const { Joi, celebrate } = require('celebrate');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCard.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/http(s?):\/\/(www\.)?[0-9a-zA-Z-]+\.[a-zA-Z]+([0-9a-zA-Z-._~:?#[\]@!$&'()*+,;=]+)/),
  }),
}), createCard);

routerCard.get('/', getCards);

routerCard.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), deleteCard);

routerCard.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), likeCard);

routerCard.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }),
}), dislikeCard);

module.exports = routerCard;
