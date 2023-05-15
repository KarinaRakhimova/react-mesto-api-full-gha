const { NODE_ENV, JWT_KEY } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/notFoundError');

// регистрация
const register = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(201).send(user))
    .catch(next);
};

// авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_KEY : 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: 'Вы авторизованы' })
        .end();
    })
    .catch(next);
};

// выход
const signout = (req, res) => {
  res.clearCookie('token', {
    maxAge: 3600000 * 24 * 7,
    httpOnly: true,
    sameSite: true,
  })
    .end();
};
// возвращает всех пользователей
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// поиск пользователя по Id
const getUserInfo = (req, res, next) => {
  User.findById(req.route.path === '/me' ? req.user._id : req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const updateUserInfo = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUserInfo,
  updateUserInfo,
  signout,
};
