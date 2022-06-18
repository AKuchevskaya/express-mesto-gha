const routerCard = require('express').Router();
const { createCard, getCards, deleteCard } = require('../controllers/cards');

routerCard.post('/cards', createCard);

routerCard.get('/cards', getCards);

routerCard.delete('/cards/:cardId', deleteCard);

module.exports = routerCard;
