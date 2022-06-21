const routerCard = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

routerCard.post('/', createCard);

routerCard.get('/', getCards);

routerCard.delete('/:cardId', deleteCard);

routerCard.put('/:cardId/likes', likeCard);

routerCard.delete('/:cardId/likes', dislikeCard);

module.exports = routerCard;
