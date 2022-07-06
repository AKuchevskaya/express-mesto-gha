const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

// описываем модель
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Поле email обязательное'],
    unique: [true, 'Пользователь с такой почтой уже существует'],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: () => 'Неверный формат email',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательно придумайте уникальный пароль'],
    minlength: [4, 'Длинна пароля должна составлять минимум 4 символа, содержать '],
    select: false, // запрет на возвращение пароля
  },
  name: {
    type: String,
    default: 'Алена',
    minlength: [2, 'Слишком короткое имя'],
    maxlength: [30, 'Имя слишком длинное, максимум 30 символов'],
  },
  about: {
    type: String,
    default: 'Веб-разработчик',
    minlength: [2, 'Расскажите о себе больше'],
    maxlength: [30, 'К сожалению это поле ограничено, максимум 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1648304286277-60fcdb49e504?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=685&q=80',
    validate: {
      validator(v) { return /https?:\/\/(www)?(\S+)([\w#!:.?+=&%@!\-/])?/.test(v); },
      message: () => 'Неверный формат ссылки на изображение',
    },
  },
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;
        throw err;
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Неправильные почта или пароль');
            err.statusCode = 401;
            throw err;
          }
          return user; // теперь user доступен
        });
    });
};

// создаем модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
