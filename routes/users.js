const router = require('express').Router();
const User = require('../models/user');
const { getUsers, createUser } = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: `Произошла ошибка-этот пользователь не найден. ${err}` }));
});

router.post('/users', createUser);

module.exports = router;
