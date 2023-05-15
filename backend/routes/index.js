const indexRouter = require('express').Router();
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const signoutRouter = require('./signout');
const userRouter = require('./users');
const cardsRouter = require('./cards');
const NotFoundError = require('../errors/notFoundError');
const auth = require('../middlewares/auth');

indexRouter.use('/signup', signupRouter);
indexRouter.use('/signin', signinRouter);
indexRouter.use('/signout', signoutRouter);
indexRouter.use('/users', auth, userRouter);
indexRouter.use('/cards', auth, cardsRouter);
indexRouter.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = indexRouter;
