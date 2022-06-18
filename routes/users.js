const routerUser = require('express').Router();
const { createUser, getUsers, findUser } = require('../controllers/users');

routerUser.post('/users', createUser);

routerUser.get('/users', getUsers);

routerUser.get('/users/:userId', findUser);

module.exports = routerUser;
