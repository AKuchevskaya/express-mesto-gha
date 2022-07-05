const jwt = require('jsonwebtoken');
const { CONFLICT_EMAIL_ERROR_CODE } = require('../constants/errors');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(CONFLICT_EMAIL_ERROR_CODE).send({ message: 'Пожалуйста авторизуйтесь.' });
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    return res.status(CONFLICT_EMAIL_ERROR_CODE).send({ message: 'Пожалуйста авторизуйтесь.' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
