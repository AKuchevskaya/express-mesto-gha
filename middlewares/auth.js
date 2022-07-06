const jwt = require('jsonwebtoken');
const { UNAUTHORIZED_ERROR_CODE } = require('../constants/errors');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что он есть или начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    const error = new Error('Пожалуйста авторизуйтесь.');
    error.statusCode = UNAUTHORIZED_ERROR_CODE;
    throw error;
  }
  // извлечём токен
  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;
  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, 'very-secret-key');
  } catch (err) {
    // отправим ошибку, если не получилось
    const error = new Error('Пожалуйста авторизуйтесь.');
    error.statusCode = UNAUTHORIZED_ERROR_CODE;
    throw error;
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
