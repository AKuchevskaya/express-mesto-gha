const mongoose = require('mongoose');

// описываем модель
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Поле name обязательное'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Обязательно расскажите о себе'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, 'Обязательно добавьте ссылку на avatar'],
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
