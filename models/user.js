const mongoose = require('mongoose');
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
    maxlength: [30, 'К сожалению это поле ограничено, максимум 30 символов'],
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
      validator: (v) => validator.isURL(v),
      message: () => 'Неверный формат ссылки на изображение',
    },
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
