const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;

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
  if (err.statusCode) {
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
