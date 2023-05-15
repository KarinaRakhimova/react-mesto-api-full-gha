const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;
const BadRequestError = require('../errors/badRequestError');
const UnauthorizedError = require('../errors/unauthorizedError');
const NotFoundError = require('../errors/notFoundError');
const ForbiddenError = require('../errors/forbiddenError');

const {
  BAD_REQUEST_ERROR_CODE,
  NOTFOUND_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  DUPLICATE_ERROR_CODE,
} = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    return;
  }
  if (err instanceof CastError) {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: err.message });
    return;
  }
  if (err instanceof DocumentNotFoundError) {
    res.status(NOTFOUND_ERROR_CODE).send({ message: err.message });
    return;
  }
  if (
    err instanceof BadRequestError
    || err instanceof UnauthorizedError
    || err instanceof NotFoundError
    || err instanceof ForbiddenError
  ) {
    res.status(err.statusCode).send({ message: err.message });
    return;
  } if (err.code === 11000) {
    res.status(DUPLICATE_ERROR_CODE).send({ message: 'Пользователь с данным email уже зарегистрирвоан' });
    return;
  }
  res.status(DEFAULT_ERROR_CODE).send({ message: err.message });
  next();
};

module.exports = errorHandler;
