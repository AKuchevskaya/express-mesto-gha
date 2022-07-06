const {
  SERVER_ERROR_CODE,
} = require('../constants/errors');

module.exports.validatorErrors = (err, req, res, next) => {
  // const { statusCode = SERVER_ERROR_CODE, message } = err;

  // res.status(statusCode).send({
  //   message: statusCode === SERVER_ERROR_CODE ? 'Ошибка сервера по умолчанию' : message,
  // });
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  }
  console.error(err.stack);
  res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
  next();
};

// app.use((err, req, res, next) => {
//   if (err.statusCode) {
//     return res.status(err.statusCode).send({ message: err.message });
//   }
//   console.error(err.stack);
//   return res.status(SERVER_ERROR_CODE).send({ message: 'Ошибка сервера по умолчанию' });
// });
