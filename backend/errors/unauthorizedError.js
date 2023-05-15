const { UNAUTHORIZED_ERROR_CODE } = require('../utils/constants');

module.exports = class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
};
