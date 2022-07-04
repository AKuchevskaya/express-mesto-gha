const routerUser = require('express').Router();
const {
  getUsers,
  getUser,
  findUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);

routerUser.get('/me', getUser);

routerUser.get('/:userId', findUser);

routerUser.patch('/me', updateUser);

routerUser.patch('/me/avatar', updateAvatar);

module.exports = routerUser;
