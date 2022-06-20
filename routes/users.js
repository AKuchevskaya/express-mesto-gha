const routerUser = require('express').Router();
const {
  getUsers,
  createUser,
  findUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

routerUser.get('/users', getUsers);

routerUser.post('/users', createUser);

routerUser.get('/users/:userId', findUser);

routerUser.patch('/users/me', updateUser);

routerUser.patch('/users/me/avatar', updateAvatar);

module.exports = routerUser;
