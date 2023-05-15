const { BAD_REQUEST_ERROR_CODE } = require('../utils/constants');

module.exports = class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR_CODE;
  }
};
