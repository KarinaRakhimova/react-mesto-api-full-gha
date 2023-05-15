const signinRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login } = require('../controllers/users');

signinRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
}), login);

module.exports = signinRouter;
