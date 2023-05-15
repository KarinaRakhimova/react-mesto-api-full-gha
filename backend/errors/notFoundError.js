const { NOTFOUND_ERROR_CODE } = require('../utils/constants');

module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOTFOUND_ERROR_CODE;
  }
};
