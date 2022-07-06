const { MONGO_DUPLICATE_ERROR_CODE } = require('../constants/errors');

class MongoServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = MONGO_DUPLICATE_ERROR_CODE;
  }
}

module.exports = MongoServerError;
