const { CONFLICT_EMAIL_ERROR_CODE } = require('../constants/errors');

class MongoServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = CONFLICT_EMAIL_ERROR_CODE;
  }
}

module.exports = MongoServerError;
