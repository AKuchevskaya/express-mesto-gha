const routerUser = require('express').Router();
const {
  getUsers,
  createUser,
  findUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);

routerUser.post('/', createUser);

routerUser.get('/:userId', findUser);

routerUser.patch('/me', updateUser);

routerUser.patch('/me/avatar', updateAvatar);

module.exports = routerUser;
