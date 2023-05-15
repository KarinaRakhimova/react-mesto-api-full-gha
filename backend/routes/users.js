const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const { URL_PATTERN } = require('../utils/constants');
const {
  getAllUsers,
  getUserInfo,
  updateUserInfo,
} = require('../controllers/users');

userRouter.get('/', getAllUsers);
userRouter.get('/me', getUserInfo);
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
}), getUserInfo);

userRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).default('Жак-Ив Кусто')
        .required(),
      about: Joi.string().min(2).max(30).default('Исследователь')
        .required(),
    }),
  }),
  updateUserInfo,
);

userRouter.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .pattern(URL_PATTERN)
        .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
        .required(),
    }),
  }),
  updateUserInfo,
);

module.exports = userRouter;
