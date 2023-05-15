const { FORBIDDEN_ERROR_CODE } = require('../utils/constants');

module.exports = class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_CODE;
  }
};
