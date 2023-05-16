const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const UnauthorizedError = require('../errors/unauthorizedError');
const { URL_PATTERN } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Email указан некорректно',
    },
  },
  password: {
    type: String,
    required: [true, 'Не заполнено поле password'],
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Недостаточное количество символов в поле name'],
    maxlength: [30, 'Превышен максимальный размер поля name'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Недостаточное количество символов в поле about'],
    maxlength: [30, 'Превышен максимальный размер поля name'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(avatar) {
        return URL_PATTERN.test(avatar);
      },
      message: 'Неверный формат ссылки',
    },
  },
}, {
  toJSON: {
    useProjection: true,
  },
  toObject: {
    useProjection: true,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('findUserByCredentials в модели юзера'));
        }
        return user;
      });
    })
    .catch((err) => console.log('cath from findUserByCredentials', err));
};
module.exports = mongoose.model('user', userSchema);
